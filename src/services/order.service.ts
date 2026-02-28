import { ErrorCode } from "../common/error-codes";
import { CreateOrderDto } from "../dtos/order.dto";
import { ErrorResponse } from "../middlewares/error-response";
import { prisma } from "../database/prisma";
import { InventoryService } from "./inventory.service";
import { OrderStatus, Prisma } from "../generated/prisma/client/client";

export class OrderService {
  private inventoryService = new InventoryService();

  async create(dto: CreateOrderDto) {
    return prisma.$transaction(async (tx) => {
      let totalAmount = new Prisma.Decimal(0);

      const products = await tx.product.findMany({
        where: {
          id: { in: dto.items.map((i) => i.productId) },
          is_active: true,
        },
      });

      if (products.length !== dto.items.length) {
        throw new ErrorResponse(
          ErrorCode.NOT_FOUND,
          "One or more products not found or inactive.",
          404,
        );
      }

      const productMap = new Map(products.map((p) => [p.id, p]));

      // Calculate total amount
      for (const item of dto.items) {
        const product = productMap.get(item.productId)!;
        totalAmount = totalAmount.add(product.unit_price.mul(item.quantity));
      }

      // Create orders and items
      const order = await tx.order.create({
        data: {
          customerName: dto.customerName,
          address: dto.address,
          notes: dto.notes,
          status: OrderStatus.PENDING,
          totalAmount,
        },
      });

      await tx.orderItem.createMany({
        data: dto.items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: productMap.get(item.productId)!.unit_price,
        })),
      });

      // Decrease stock using InventoryService
      for (const item of dto.items) {
        await this.inventoryService.decreaseStock(
          item.productId,
          item.quantity,
          order.id,
          "Order creation",
          tx,
        );
      }

      return order;
    });
  }

  async getAll() {
    return prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new ErrorResponse(ErrorCode.NOT_FOUND, "Order not found", 404);
    }

    return order;
  }
}

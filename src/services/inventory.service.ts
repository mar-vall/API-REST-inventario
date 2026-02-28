import { ErrorCode } from "../common/error-codes";
import { ErrorResponse } from "../middlewares/error-response";
import { MovementType, Prisma } from "../generated/prisma/client/client";
import { prisma } from "../database/prisma";

export class InventoryService {
  private getClient(tx?: Prisma.TransactionClient) {
    return tx ?? prisma;
  }

  async increaseStock(
    productId: string,
    quantity: number,
    reason = "Manual entry",
    tx?: Prisma.TransactionClient,
  ) {
    const db = this.getClient(tx);

    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new ErrorResponse(ErrorCode.NOT_FOUND, "Product not found", 404);
    }

    const stockBefore = product.stock;
    const stockAfter = stockBefore + quantity;

    await db.product.update({
      where: { id: productId },
      data: { stock: stockAfter },
    });

    await db.inventoryMovement.create({
      data: {
        productId,
        type: MovementType.IN,
        quantity,
        stockBefore,
        stockAfter,
        reason,
      },
    });

    return stockAfter;
  }

  async decreaseStock(
    productId: string,
    quantity: number,
    relatedOrderId?: string,
    reason = "Order creation",
    tx?: Prisma.TransactionClient,
  ) {
    const db = this.getClient(tx);

    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new ErrorResponse(ErrorCode.NOT_FOUND, "Product not found", 404);
    }

    if (product.stock < quantity) {
      throw new ErrorResponse(
        ErrorCode.BUSINESS_RULE_VIOLATION,
        "Insufficient stock",
        400,
      );
    }

    const stockBefore = product.stock;
    const stockAfter = stockBefore - quantity;

    await db.product.update({
      where: { id: productId },
      data: { stock: stockAfter },
    });

    await db.inventoryMovement.create({
      data: {
        productId,
        type: MovementType.OUT,
        quantity,
        relatedOrderId,
        stockBefore,
        stockAfter,
        reason,
      },
    });

    return stockAfter;
  }

  async getMovements(productId: string) {
    return prisma.inventoryMovement.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
    });
  }
}

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

    const updated = await db.product.updateMany({
      where: {
        id: productId,
        stock: { gte: quantity },
      },
      data: {
        stock: { decrement: quantity },
      },
    });

    if (updated.count === 0) {
      throw new ErrorResponse(
        ErrorCode.BUSINESS_RULE_VIOLATION,
        "Insufficient stock",
        400,
      );
    }

    const stockAfter = product.stock - quantity;

    await db.inventoryMovement.create({
      data: {
        productId,
        type: MovementType.OUT,
        quantity,
        relatedOrderId,
        stockBefore: product.stock,
        stockAfter,
        reason,
      },
    });

    return stockAfter;
  }

  async getMovements(productId: string, type?: MovementType) {
    return prisma.inventoryMovement.findMany({
      where: {
        productId,
        ...(type && { type }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

import { Prisma } from "@prisma/client";
import { CreateProductDto } from "../dtos/product.dto";
import { UpdateProductDto } from "../dtos/product.dto";
import { prisma } from "../database/prisma";
import { ErrorResponse } from "../middlewares/error-response";
import { ErrorCode } from "../common/error-codes";

export class ProductService {
  async create(dto: CreateProductDto) {
    const existing = await prisma.product.findFirst({
      where: {
        name: dto.name,
        is_active: true,
      },
    });

    if (existing) {
      throw new ErrorResponse(
        ErrorCode.DUPLICATE_RESOURCE,
        "Active product with this name already exists.",
        409,
      );
    }

    return prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        unit_price: new Prisma.Decimal(dto.unit_price),
        stock: dto.stock ?? 0,
      },
    });
  }

  async findAll() {
    return prisma.product.findMany({
      where: { is_active: true },
    });
  }

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new ErrorResponse(ErrorCode.NOT_FOUND, "Product not found", 404);
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.product.findUnique({ where: { id } });

      if (!existing) {
        throw new ErrorResponse(ErrorCode.NOT_FOUND, "Product not found", 404);
      }

      if (dto.stock !== undefined && dto.stock < 0) {
        throw new ErrorResponse(
          ErrorCode.VALIDATION_ERROR,
          "Stock cannot be negative.",
          400,
        );
      }

      // Validar duplicado si cambia nombre
      if (dto.name && dto.name !== existing.name) {
        const duplicate = await tx.product.findFirst({
          where: {
            name: dto.name,
            is_active: true,
            NOT: { id },
          },
        });

        if (duplicate) {
          throw new ErrorResponse(
            ErrorCode.DUPLICATE_RESOURCE,
            "Another active product with this name exists.",
            409,
          );
        }
      }

      const updateData: any = { ...dto };

      if (dto.unit_price !== undefined) {
        updateData.unit_price = new Prisma.Decimal(dto.unit_price);
      }

      // Generar histórico
      const historyEntries = [];

      for (const key of Object.keys(updateData)) {
        const oldValue = (existing as any)[key];
        const newValue = updateData[key];

        if (
          newValue !== undefined &&
          oldValue?.toString() !== newValue?.toString()
        ) {
          historyEntries.push({
            productId: id,
            fieldName: key,
            oldValue: oldValue?.toString() ?? null,
            newValue: newValue?.toString() ?? null,
          });
        }
      }

      if (historyEntries.length > 0) {
        await tx.productHistory.createMany({
          data: historyEntries,
        });
      }

      return tx.product.update({
        where: { id },
        data: updateData,
      });
    });
  }

  async delete(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new ErrorResponse(ErrorCode.NOT_FOUND, "Product not found", 404);
    }

    return prisma.product.update({
      where: { id },
      data: { is_active: false },
    });
  }

  async getHistory(productId: string) {
    return prisma.productHistory.findMany({
      where: { productId },
      orderBy: { changedAt: "desc" },
    });
  }
}

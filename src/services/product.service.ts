import { PrismaClient, Prisma } from "@prisma/client";
import { CreateProductDto } from "../dtos/product.dto";
import { UpdateProductDto } from "../dtos/product.dto";
import { prisma } from "../database/prisma";

export class ProductService {

  async create(dto: CreateProductDto) {

    const existing = await prisma.product.findFirst({
      where: {
        name: dto.name,
        is_active: true,
      },
    });

    if (existing) {
      throw new Error("Active product with this name already exists.");
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
      throw new Error("Product not found.");
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    return prisma.$transaction(async (tx) => {

      const existing = await tx.product.findUnique({ where: { id } });

      if (!existing) {
        throw new Error("Product not found.");
      }

      if (dto.stock !== undefined && dto.stock < 0) {
        throw new Error("Stock cannot be negative.");
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
          throw new Error("Another active product with this name exists.");
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
      throw new Error("Product not found.");
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

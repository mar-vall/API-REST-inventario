import { Request, Response } from "express";
import { InventoryService } from "../services/inventory.service";
import { AdjustInventoryDto } from "../dtos/inventory.dto";
import { MovementType } from "../generated/prisma/client/browser";
import { ErrorResponse } from "../middlewares/error-response";
import { ErrorCode } from "../common/error-codes";

export class InventoryController {
  private inventoryService = new InventoryService();

  increaseStock = async (req: Request, res: Response) => {
    const dto = req.body as AdjustInventoryDto;

    const stockAfter = await this.inventoryService.increaseStock(
      dto.productId,
      dto.quantity,
      dto.reason,
    );

    return res.status(200).json({
      message: "Stock increased successfully",
      stock: stockAfter,
    });
  };

  decreaseStock = async (req: Request, res: Response) => {
    const dto = req.body as AdjustInventoryDto;

    const stockAfter = await this.inventoryService.decreaseStock(
      dto.productId,
      dto.quantity,
      undefined,
      dto.reason ?? "Manual adjustment",
    );

    return res.status(200).json({
      message: "Stock decreased successfully",
      stock: stockAfter,
    });
  };

  getMovements = async (req: Request, res: Response) => {
    const productId = Array.isArray(req.params.productId)
      ? req.params.productId[0]
      : req.params.productId;
    const { type } = req.query;

    let movementType: MovementType | undefined;

    if (type) {
      if (!Object.values(MovementType).includes(type as MovementType)) {
        throw new ErrorResponse(
          ErrorCode.BAD_REQUEST,
          "Invalid movement type",
          400,
        );
      }
      movementType = type as MovementType;
    }

    const movements = await this.inventoryService.getMovements(
      productId,
      movementType,
    );

    return res.status(200).json(movements);
  };
}

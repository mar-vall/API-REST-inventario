import { Request, Response } from "express";
import { InventoryService } from "../services/inventory.service";
import { AdjustInventoryDto } from "../dtos/inventory.dto";

export class InventoryController {
  private inventoryService = new InventoryService();

  increaseStock = async (req: Request, res: Response) => {
    const dto = req.body as AdjustInventoryDto;

    const stockAfter = await this.inventoryService.increaseStock(
      dto.productId,
      dto.quantity,
      dto.reason
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
      dto.reason ?? "Manual adjustment"
    );

    return res.status(200).json({
      message: "Stock decreased successfully",
      stock: stockAfter,
    });
  };
}

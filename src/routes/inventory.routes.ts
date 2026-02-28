import { Router } from "express";
import { InventoryController } from "../controllers/inventory.controller";

const router = Router();
const controller = new InventoryController();

router.post("/in", controller.increaseStock);

router.post("/out", controller.decreaseStock);

router.get("/:productId/movements", controller.getMovements);

export default router;

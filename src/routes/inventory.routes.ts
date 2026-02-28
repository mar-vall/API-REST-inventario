import { Router } from "express";
import { InventoryController } from "../controllers/inventory.controller";
import { AdjustInventoryDto, GetMovementsQueryDto } from "../dtos/inventory.dto";
import { validateDto } from "../middlewares/validate.dto";

const router = Router();
const controller = new InventoryController();

/**
 * @swagger
 * /inventory/in:
 *   post:
 *     summary: Increase stock
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdjustInventoryDto'
 *     responses:
 *       200:
 *         description: Stock increased successfully
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AdjustInventoryResponse'
 *       400:
 *         description: Validation error
 *         content:
 *          application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/in",
  validateDto(AdjustInventoryDto),
  controller.increaseStock
);

/**
 * @swagger
 * /inventory/out:
 *   post:
 *     summary: Decrease stock manually
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdjustInventoryDto'
 *     responses:
 *       200:
 *         description: Stock decreased successfully
 *       400:
 *         description: Validation error or insufficient stock
 */
router.post(
  "/out",
  validateDto(AdjustInventoryDto),
  controller.decreaseStock
);

/**
 * @swagger
 * /inventory/{productId}/movements:
 *   get:
 *     summary: Get inventory movements by product
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [IN, OUT]
 *     responses:
 *       200:
 *         description: List of inventory movements
 */
router.get(
  "/:productId/movements",
  validateDto(GetMovementsQueryDto),
  controller.getMovements
);

export default router;

import { Router } from "express";
import { InventoryController } from "../controllers/inventory.controller";

const router = Router();
const controller = new InventoryController();

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory management
 */

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
 *             $ref: '#/components/schemas/AdjustInventory'
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
router.post("/in", controller.increaseStock);

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
 *             $ref: '#/components/schemas/AdjustInventory'
 *     responses:
 *       200:
 *         description: Stock decreased successfully
 *       400:
 *         description: Validation error or insufficient stock
 */
router.post("/out", controller.decreaseStock);

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
router.get("/:productId/movements", controller.getMovements);

export default router;

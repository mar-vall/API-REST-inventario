import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { validateDto } from "../middlewares/validate.dto";
import { CreateOrderDto } from "../dtos/order.dto";

const router = Router();
const controller = new OrderController();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *
 *     tags:
 *       - Orders
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderDto'
 *
 *     responses:
 *       201:
 *         description: Order successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *
 *       400:
 *         description: Business rule violation (invalid quantity or insufficient stock)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       404:
 *         description: One or more products not found or inactive
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  validateDto(CreateOrderDto),
  controller.create
);

export default router;

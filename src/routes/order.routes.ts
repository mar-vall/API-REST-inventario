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
 *             $ref: '#/components/schemas/CreateOrderRequest'
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

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags:
 *       - Orders
 *
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderWithItemsResponse'
 *
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  controller.getAll
);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *
 *     tags:
 *       - Orders
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID
 *
 *     responses:
 *       200:
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderWithItemsResponse'
 *
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id",
  controller.getById
);

export default router;

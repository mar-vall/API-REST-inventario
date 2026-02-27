import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";
import { validateDto } from "../middlewares/validate.dto";

const router = Router();
const controller = new ProductController();

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductDto'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid data or duplicate product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/",
  validateDto(CreateProductDto),
  controller.create.bind(controller)
);

router.put(
  "/:id",
  validateDto(UpdateProductDto),
  controller.update.bind(controller)
);

router.get("/", controller.findAll.bind(controller));

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", controller.findById.bind(controller));
router.delete("/:id", controller.delete.bind(controller));
router.get("/:id/history", controller.history.bind(controller));

export default router;
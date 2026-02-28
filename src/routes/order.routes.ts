import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { validateDto } from "../middlewares/validate.dto";
import { CreateOrderDto } from "../dtos/order.dto";

const router = Router();
const controller = new OrderController();

// Crear orden
router.post(
  "/",
  validateDto(CreateOrderDto),
  controller.create
);

export default router;

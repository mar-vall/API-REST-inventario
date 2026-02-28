import { Router } from "express";
import productRoutes from "./product.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../config/swagger";
import inventoryRoutes from "./inventory.routes";
import orderRoutes from "./order.routes";

export const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ status: "OKi" });
});

router.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

router.use("/products", productRoutes);

router.use("/inventory", inventoryRoutes);

router.use("/orders", orderRoutes);

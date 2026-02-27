import { Router } from "express";
import productRoutes from "./product.routes";

export const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ status: "OKi" });
});

router.use("/products", productRoutes);

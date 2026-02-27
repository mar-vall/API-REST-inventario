import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";
import { validateDto } from "../middlewares/validate.dto";

const router = Router();
const controller = new ProductController();

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
router.get("/:id", controller.findById.bind(controller));
router.delete("/:id", controller.delete.bind(controller));
router.get("/:id/history", controller.history.bind(controller));

export default router;
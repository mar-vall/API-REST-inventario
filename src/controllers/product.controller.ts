import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

const service = new ProductService();

export class ProductController {
  async create(req: Request, res: Response) {
    const product = await service.create(req.body);
    res.status(201).json(product);
  }

  async findAll(_req: Request, res: Response) {
    const products = await service.findAll();
    res.json(products);
  }

  async findById(req: Request<{ id: string }>, res: Response) {
    const product = await service.findById(req.params.id);
    res.json(product);
  }

  async update(req: Request<{ id: string }>, res: Response) {
    const product = await service.update(req.params.id, req.body);
    res.json(product);
  }

  async delete(req: Request<{ id: string }>, res: Response) {
    await service.delete(req.params.id);
    res.status(204).send();
  }

  async history(req: Request<{ id: string }>, res: Response) {
    const history = await service.getHistory(req.params.id);
    res.json(history);
  }
}

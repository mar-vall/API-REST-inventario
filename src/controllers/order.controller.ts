import { Request, Response } from "express";
import { OrderService } from "../services/order.service";

export class OrderController {
  constructor(private service = new OrderService()) {}

  create = async (req: Request, res: Response) => {
    const order = await this.service.create(req.body);
    res.status(201).json(order);
  };

  getAll = async (_req: Request, res: Response) => {
    const orders = await this.service.getAll();
    res.json(orders);
  };

  getById = async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const order = await this.service.getById(id);
    res.json(order);
  };
}

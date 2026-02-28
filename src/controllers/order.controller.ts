import { Request, Response } from "express";
import { OrderService } from "../services/order.service";

export class OrderController {
  constructor(private service = new OrderService()) {}

  create = async (req: Request, res: Response) => {
    const order = await this.service.create(req.body);
    res.status(201).json(order);
  };
}

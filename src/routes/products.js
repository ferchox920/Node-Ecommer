import { Router } from "express";
import { createProducts } from "../services/products.js";

const productRouter = Router();

productRouter.post("/", async (req, res) => {
  try {
    const product = req.body;
    const response = await createProducts(product);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default productRouter;

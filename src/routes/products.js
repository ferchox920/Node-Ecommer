import { Router } from "express";
import { createProducts, getProduct, getProducts } from "../services/products.js";

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

productRouter.get("/", async (req, res) => {
  try {
    const response = await getProducts();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});


productRouter.get("/:id", async (req, res) => {
  try {
    const response = await getProduct(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

productRouter.put("/:id", async (req, res) => {
  try {
    const response = await getProduct(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
}

);

productRouter.delete("/:id", async (req, res) => {
  try {
    const response = await getProduct(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});
export default productRouter;

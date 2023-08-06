import { Router } from "express";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../services/products.js";

const productRouter = Router();

productRouter.post("/", async (req, res) => {
  try {
    const product = req.body;
    const createdProduct = await createProduct(product);
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

productRouter.get("/", async (req, res) => {
  try {
    const response = await getProducts();
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


productRouter.get("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await getProduct(productId);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
})

productRouter.put("/:id", async (req, res) => {
  try {
    const product = req.body;
    const { id } = req.params;
    const response = await updateProduct(id, product);
    res.status(200).json(response);
  } catch (error) {
    if (error.message.includes("Product with this code already exists")) {
      res.status(409).json({ error: error.message });
    } else if (error.message === "Product not found") {
      res.status(404).json({ error: error.message });
    } else {
      res
        .status(500)
        .json({
          error: "Failed to update the product. Please try again later.",
        });
    }
  }
});

productRouter.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await deleteProduct(productId);

    if (deletedProduct.deletedCount === 0) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.status(200).json({ message: "Product deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the product. Please try again later." });
  }
});

export default productRouter;

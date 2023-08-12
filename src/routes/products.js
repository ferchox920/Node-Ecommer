import { Router } from "express";
import { countProducts, createProduct, deleteProduct, findFeatured, getProduct, getProducts, updateProduct } from "../services/products.js";
import fileUpload from "express-fileupload";
import fs from 'fs'; 

const productRouter = Router();

productRouter.post("/", fileUpload(), async (req, res) => {
  try {
    if (!req.files || !req.files.images) {
      return res.status(400).json({ error: "No image in the request" });
    }
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    const file = req.files.images;
    const product = req.body;
    const createdProduct = await createProduct(product, file, basePath);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error get products:", error.message);
    res.status(400).json({ error: error.message });
  }
});

//Can send query params to filter products or not for find all 
productRouter.get("/", async (req, res) => {
  try {
    let filter = {};
    if (req.query.category) {
      const categories = req.query.category.split(",").filter((category) => category.trim() !== "");
      if (categories.length > 0) {
        filter = { category: { $in: categories } };
      }
    }
    const response = await getProducts(filter);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to get products. Please try again later." });
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

productRouter.get("/get/count", async (req, res) => {
  try {
    const response = await countProducts();
    res.status(200).json({productCount:response});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})

productRouter.get("/get/featured/:count?", async (req, res) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    console.log(count);
    const response = await findFeatured(+count);
    res.status(200).json(response);
  
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})



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

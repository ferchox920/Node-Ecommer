import mongoose from "mongoose";
import Category from "../models/category.js";
import Product from "../models/products.js";

export async function createProduct(product) {
  try {
    const { category, code } = product;

    const existingProduct = await Product.findOne({ code });
    if (existingProduct) {
      throw new Error("Product with the given code already exists");
    }

    if(!mongoose.isValidObjectId(category)){
      throw new Error("Invalid category");
    }

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      throw new Error("Category not found");
    }

    const createdProduct = await Product.create(product);
    return createdProduct;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}



export async function getProducts() {
  try {
    return await Product.find().populate('category');
  } catch (error) {
    console.error("Error getting products:", error);
    throw error;
  }
}


export async function getProduct(productId) {
  try {
    if(!mongoose.isValidObjectId(productId)){
      throw new Error("Invalid id");
    }
    const product = await Product.findById(productId).populate('category');
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error) {
    console.error("Error getting product:", error);
    throw error;
  }
}


export async function updateProduct(productId, updatedProduct) {
  try {
    const { code } = updatedProduct;
       if(!mongoose.isValidObjectId(productId)){
      throw new Error("Invalid id");
    }
    const existingProductWithCode = await Product.findOne({ code });

    if (existingProductWithCode && existingProductWithCode._id.toString() !== productId) {
      throw new Error("Product with this code already exists");
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    product.name = updatedProduct.name || product.name;
    product.code = updatedProduct.code || product.code;
    product.description = updatedProduct.description || product.description;
    product.richDescription = updatedProduct.richDescription || product.richDescription;
    product.image = updatedProduct.image || product.image;
    product.images = updatedProduct.images || product.images;
    product.brand = updatedProduct.brand || product.brand;
    product.price = updatedProduct.price || product.price;
    product.category = updatedProduct.category || product.category;
    product.countInStock = updatedProduct.countInStock || product.countInStock;
    product.rating = updatedProduct.rating || product.rating;
    product.isFeatured = updatedProduct.isFeatured || product.isFeatured;

    const updatedProductResult = await product.save();
    return updatedProductResult;
  } catch (error) {
    console.error("Error updating product:", error.message);
    throw new Error("Failed to update the product. Please try again later.");
  }
}


export async function deleteProduct(productId) {
  try {
    if(!mongoose.isValidObjectId(productId)){
      throw new Error("Invalid id");
    }
    return await Product.deleteOne({ _id: productId }); 
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}
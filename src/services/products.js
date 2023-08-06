import Category from "../models/category.js";
import Product from "../models/products.js";

export async function createProducts(product) {
  try {

    const {categoryId} = product;
    const category = await Category.findById({where: {categoryId}});
    if (!category){
      console.log("Category not found");
      throw new Error("Category not found");}
    if (product) return await Product.create(product);
  } catch (error) {
    console.error("Error creating product:", error);
    throw error; // Re-lanzamos el error para que quien llame a esta función pueda manejarlo
  }
}

export async function getProducts() {
  try {
    return await Product.find();
  } catch (error) {
    console.error("Error getting products:", error);
    throw error;
  }
}


export async function getProduct(productId) {
  try {
    return await Product.findById(productId);
  } catch (error) {
    console.error("Error getting product:", error);
    throw error;
  }
}

export async function updateProduct(productId, product) {
  try {
    return await Product.update(productId, product);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

export async function deleteProduct(productId) {
  try {
    return await Product.delete(productId);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}
import Product from "../models/products.js";

export async function createProducts(product) {
  try {
    if (product) return await Product.create(product);
  } catch (error) {
    console.error("Error creating product:", error);
    throw error; // Re-lanzamos el error para que quien llame a esta función pueda manejarlo
  }
}

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

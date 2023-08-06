import Category from "../models/category.js";

export async function createCategory(category) {
    try {
      if (category) return await Category.create(category);
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

export async function getCategories() {
    try {
      return await Category.find();
    } catch (error) {
      console.error("Error getting products:", error);
      throw error;
    }
  }

  export async function getCategory(_id) {
    try {
      return await Category.findById(_id); // Utiliza el método findById en lugar de findOne
    } catch (error) {
      console.error("Error getting category:", error);
      throw error;
    }
  }

  export async function updateCategory(id, product) {
    try {
      return await Category.update(product, {
        where: { id },
      });
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }
  
  export async function deleteCategory(id) {
    try {
      return await Category.destroy({
        where: { id },
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  
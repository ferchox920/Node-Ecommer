import Category from "../models/category.js";

export async function createCategory(category) {
  try {
    const { name } = category;
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

    if (existingCategory) {
      throw new Error("Category with that name already exists");
    }
    const createdCategory = await Category.create(category);
    return createdCategory;
  } catch (error) {
    console.error("Error creating category:", error);
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

  export async function updateCategory(categoryId, updatedCategory) {
    try {
      const { name } = updatedCategory;
  
      // Verificar si existe una categoría con el mismo nombre
      const existingCategoryWithSameName = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  
      if (existingCategoryWithSameName && existingCategoryWithSameName._id.toString() !== categoryId) {
        throw new Error("Category with the same name already exists");
      }
  
      // Buscar la categoría a actualizar
      const existingCategory = await Category.findById(categoryId);
  
      if (!existingCategory) {
        throw new Error("Category not found");
      }
  
      // Actualizar los campos de la categoría con los valores del objeto updatedCategory
      existingCategory.name = updatedCategory.name || existingCategory.name;
      existingCategory.icon = updatedCategory.icon || existingCategory.icon;
      existingCategory.color = updatedCategory.color || existingCategory.color;
  
      // Guardar la categoría actualizada en la base de datos
      const updatedCategoryResult = await existingCategory.save();
      return updatedCategoryResult;
    } catch (error) {
      console.error("Error updating category:", error.message);
      throw new Error("Failed to update the category. Please try again later.");
    }
  }
  
  
  
  export async function deleteCategory(id) {
    try {
      return await Category.deleteOne({ _id: id });
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }


  
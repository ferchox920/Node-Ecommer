import { Router } from "express";
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from "../services/category.js";

const categoryRouter = Router();

categoryRouter.post("/", async (req, res) => {
  try {
    const category = req.body;
    const createdCategory = await createCategory(category);
    res.status(201).json(createdCategory);
  } catch (error) {
    if (error.message === "Category with that name already exists") {
      res.status(409).json({ error: error.message });
    } else {
      console.error("Error creating category:", error.message);
      res.status(500).json({ error: "Failed to create the category. Please try again later." });
    }
  }
});

categoryRouter.get("/", async (req, res) => {
  try {
    const response = await getCategories();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

categoryRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getCategory(id);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting category:", error.message);
    res.status(500).json(error);
  }
});

categoryRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = req.body;

    const updatedCategoryResult = await updateCategory(id, updatedCategory);
    res.status(200).json(updatedCategoryResult);
  } catch (error) {
    console.error("Error updating category:", error.message);
    res.status(500).json({ error: error.message });
  }
});

categoryRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteCategory(id);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).json(error);
  }
});
export default categoryRouter;

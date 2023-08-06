import { Router } from "express";
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from "../services/category.js";

const categoryRouter = Router();

categoryRouter.post("/", async (req, res) => {
  try {
    const category = req.body;
    const response = await createCategory(category);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json(error);
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
    res.status(500).json(error);
  }
});

categoryRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = req.body;
    const response = await updateCategory(id, category);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

categoryRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteCategory(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});
export default categoryRouter;

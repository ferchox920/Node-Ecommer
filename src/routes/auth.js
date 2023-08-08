
import { Router } from 'express';
import { login } from '../services/auth.js';

const authRoutes = Router();

authRoutes.post("/login", async (req, res) => {
  try {
    const userData = req.body;
    const createdUser = await login(userData);
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user. Please try again later." });
  }
});


export default authRoutes;

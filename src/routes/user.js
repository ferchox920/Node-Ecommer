
import { Router } from 'express';
import { createUser } from '../services/user.js';

const userRouter = Router();

userRouter.post("/", async (req, res) => {
  try {
    const userData = req.body;
    const createdUser = await createUser(userData);
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user. Please try again later." });
  }
});

export default userRouter;


import { Router } from 'express';
import { createUser, getAllUsers, getUserById } from '../services/user.js';

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

userRouter.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to get users. Please try again later." });
  }
})

userRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to get user. Please try again later." });
  }
})

export default userRouter;

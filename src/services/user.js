import User from "../models/user";

export async function createUser(userData) {
  try {
    const newUser = new User(userData);
    const createdUser = await newUser.save();
    return createdUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user. Please try again later.");
  }
}

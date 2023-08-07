import User from "../models/user.js";

export async function createUser(userData) {
  try {
    const {email} = userData;
    const existingUser = await User.findOne({email});
    if (existingUser) {
        throw new Error("User already exists.");
    }

    const newUser = new User(userData);
    const createdUser = await newUser.save();
    return createdUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user. Please try again later.");
  }
}

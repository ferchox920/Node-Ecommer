import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function createUser(userData) {
  try {
    const { email, password } = userData;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ ...userData, password: hashedPassword });
    const createdUser = await newUser.save();

    const payload = {
      id: createdUser.id,
      isAdmin: createdUser.isAdmin,
    };

    const credentials = {
      access_token: jwt.sign(payload, process.env.JWT_SECRET),
      refresh_token: jwt.sign(
        {
          ...payload,
          type: "REFRESH",
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION_TIME } // Utiliza expiresIn para definir la duración
      ),
    };

    return { createdUser, credentials };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user. Please try again later.");
  }
}

export async function getUserById(id) {
  try {
    const user = await User.findById({ id }).select("-passwordHash");
    if (!user) {
      throw new Error("User does not exist.");
    }
    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    throw new Error("Failed to get user. Please try again later.");
  }
}

export async function getAllUsers() {
  try {
    const users = await User.find().select("phone name email");
    return users;
  } catch (error) {
    console.error("Error getting users:", error);
    throw new Error("Failed to get users. Please try again later.");
  }
}

export async function updateUser(id, userData) {
  try {
    const user = await User.findByIdAndUpdate(id, userData, { new: true });
    if (!user) {
      throw new Error("User does not exist.");
    }
    return user;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user. Please try again later.");
  }
}


export async function deleteUser(_id) {
  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      throw new Error("User does not exist.");
    }
    return user;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user. Please try again later.");
  }
}

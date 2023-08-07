import User from "../models/user.js";
import bcrypt from "bcrypt";

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
      name: createdUser.name,
      email: createdUser.email,
    };

    
    return createdUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user. Please try again later.");
  }
}

export async function getUserById(id) {
  try {
    const user = await User.findById({id}).select('-passwordHash');
    if (!user) {
        throw new Error("User does not exist.");
    }
    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    throw new Error("Failed to get user. Please try again later.");
  }
}

export async function getAllUsers(){
  try {
    const users = await User.find().select('-passwordHash');
    return users;
  }catch(error){
    console.error("Error getting users:", error);
    throw new Error("Failed to get users. Please try again later.");
  }
}
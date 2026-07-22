import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import generateToken from "../utils/generateToken";

// Register User
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Login User
export const loginUser = async (req: Request, res: Response) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (
      user &&
      (await bcrypt.compare(password, user.password))
    ) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({
        message: "Invalid Email or Password",
      });
    }

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findById(userId).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
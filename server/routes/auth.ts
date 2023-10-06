import jwt from "jsonwebtoken";
import express from "express";
import { authenticateJwt, SECRET } from "../middleware/";
import { User } from "../db";
import { ParseStatus, z } from "zod";

const router = express.Router();

const userInput = z.object({
  username: z
    .string()
    .email({
      message: "Invalid email. Please enter a valid email address",
    })
    .min(1)
    .max(15)
    .trim(),
  password: z.string().min(6).max(15),
});

router.post("/signup", async (req, res) => {
  const parsedUserData = userInput.safeParse(req.body);
  // const { username, password } = req.body;

  if (!parsedUserData.success) {
    res.status(411).json({ message: parsedUserData.error });
    return;
  }

  const username = parsedUserData.data.username;
  const password = parsedUserData.data.password;

  const user = await User.findOne({ username });
  if (user) {
    res.status(403).json({ message: "User already exists" });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: "1h" });
    res.json({ message: "User created successfully", token });
  }
});

router.post("/login", async (req, res) => {
  const parsedUserData = userInput.safeParse(req.body);
  // const { username, password } = req.body;
  if (!parsedUserData.success) {
    res.status(411).json({ message: parsedUserData.error });
    return;
  }

  const username = parsedUserData.data.username;
  const password = parsedUserData.data.password;

  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

router.get("/me", authenticateJwt, async (req, res) => {
  const userId = req.headers["userId"];
  const user = await User.findOne({ _id: userId });
  if (user) {
    res.json({ username: user.username });
  } else {
    res.status(403).json({ message: "User not logged in" });
  }
});

export default router;

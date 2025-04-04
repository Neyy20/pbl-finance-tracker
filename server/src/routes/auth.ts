import express from "express";
import UserModel from "../schema/user";

const router = express.Router();

// Login user function
const loginUser = async (req: express.Request, res: express.Response) => {
  try {
    const { username, password } = req.body;
    
    const user = await UserModel.findOne({ username });
    
    if (!user) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }
    
    if (user.password !== password) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }
    
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email
    };
    
    res.status(200).json(userResponse);
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Failed to login" });
  }
};

// Get user profile function
const getUserProfile = async (req: express.Request, res: express.Response) => {
  try {
    const userId = req.params.userId;
    
    const user = await UserModel.findById(userId).select("-password");
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

// Register user function
const registerUser = async (req: express.Request, res: express.Response) => {
  try {
    const { username, password, email } = req.body;
    
    const existingUser = await UserModel.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      res.status(400).json({ 
        error: "User already exists with this username or email" 
      });
      return;
    }
    
    const newUser = new UserModel({
      username,
      password,
      email
    });
    
    await newUser.save();
    
    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email
    };
    
    res.status(201).json(userResponse);
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Failed to register user" });
  }
};

// Register routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile/:userId", getUserProfile);

export default router;
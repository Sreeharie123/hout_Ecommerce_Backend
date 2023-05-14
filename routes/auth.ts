import express from "express";
import { UserModel } from "../models/userSchema";
import { user } from "../interfaces/userInterface";
const router = express.Router();

//Create User
router.post("/register", async (req, res) => {
  const { error } = req.body;
  if (error) return res.status(500).send(error[0].message);
  const newUser = new UserModel<user>({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });
  try {
    const saveUser = await newUser.save();
    res.status(200).json(saveUser);
  } catch (error) {
    res.status(500).json("you are all ready registered login please");
  }
});

router.post("/login", async (req, res) => {
  try {
    const userEmail = await UserModel.findOne({ email: req.body.email });
    if (!userEmail) return res.status(400).json("Sign up please");
    res.send(userEmail);
  } catch (error) {
    res.status(500).json(error);
  }
});

export const authentication = router;

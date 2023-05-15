import express from "express";
import { UserModel } from "../models/userSchema";
import { user, userDetails } from "../interfaces/userInterface";
import bcrypt from "bcrypt"
const router = express.Router();

//Create User
router.post("/register", async (req, res) => {
  const { error } = req.body;
  if (error) return res.status(500).json(error[0].message);

  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(req.body.password, salt)

  const newUser = new UserModel<user>({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashPassword,
    role: req.body.role,
  });
  try {
    const saveUser = await newUser.save();
    res.status(200).json(saveUser);
  } catch (error) {
    res.status(500).json("Email is already exist");
  }
});

//login User
router.post("/login", async (req, res) => {
    const {error}=req.body;
    if(error) return res.status(500).json(error[0].message)
  try {
    const user  = await UserModel.findOne<userDetails>({ email: req.body.email })
    if (!user) return res.status(400).json("There is no user with this email");

    const realPassword=await bcrypt.compare(req.body.password,user._doc.password)
    if(!realPassword) return res.status(400).json("password is wrong")

    const{password,...others} =user._doc

    res.status(200).json(others)

  } catch (error) {
    res.status(500).json(error);
  }
});

export const authentication = router;

import express from "express";
import { UserModel } from "../models/userSchema";
import { user, userDetails } from "../interfaces/userInterface";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const router = express.Router();

//Create User
router.post("/register", async (req, res) => {

  try {
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(req.body.password, salt)
  const newUser = new UserModel<user>({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashPassword,
    role: req.body.role,
  });
 
    const saveUser = await newUser.save();
    res.status(200).json(saveUser);
  } catch (error) {
    res.status(500).json("Email is already exist");
  }
});

//login User
router.post("/login", async (req, res) => {
  try {
    const user  = await UserModel.findOne<userDetails>({ email: req.body.email })
    if (!user) return res.status(400).json("There is no user with this email");

    const realPassword=await bcrypt.compare(req.body.password,user._doc.password)
    if(!realPassword) return res.status(400).json("password is wrong")

    const Secrete_jwt_Key=process.env.JWT_KEY as string
    
    const accessToken = jwt.sign({
      id:user._doc._id,
      role:user._doc.role,
      firstName:user._doc.firstName
    },Secrete_jwt_Key,{expiresIn:"3d"})
    
    const{password,...others} =user._doc
    res.status(200).json({...others,accessToken})

  } catch (error) {
    res.status(500).json(error);
  }
});

export const authentication = router;

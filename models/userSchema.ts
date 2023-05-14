import mongoose from "mongoose";
import { user } from "../interfaces/userInterface";


const userSchema= new mongoose.Schema<user>({
    firstName:{
     type:String,
     required:true
    },
    lastName:{
     type:String,
     required:true
    },
    email:{
     type:String,
     required:true,
     unique:true
    },
    password:{
     type:String,
     required:true
    },
    role:{
     type:String,
     default:'user'
    }
 },{timestamps:true})

 export const UserModel=mongoose.model("user",userSchema)
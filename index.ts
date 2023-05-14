import mongoose, { Mongoose } from "mongoose"
import express from "express"
import cors from 'cors'
import dotenv from 'dotenv'
import {authentication} from './routes/auth'

//Variables
const app=express()
const port=5000
dotenv.config()
const mongoDbURL=process.env.MONGO_DB_URL as string

//MiddleWares
app.use(cors())
app.use(express.json())
app.use('/auth',authentication)


//MongoDB Connection
mongoose.connect(mongoDbURL).then(()=>{
    console.log("database connected successfully")
})


app.listen(process.env.PORT||port,()=>{
    console.log(`port listening ${port}`)
})


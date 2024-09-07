import express from 'express'
import connectDB from './db.js'
import dotenv from 'dotenv'
import router from './routes/routes.js'
import bodyParser from 'body-parser'
import cors from 'cors'
const app = express()
dotenv.config()
connectDB().then(()=>console.log("MONGO DB CONNECTED"))
app.use(express.json())
app.use(cors())

app.use("/api/v1/", router)

app.listen(5000, ()=>{
    console.log("Running on http://localhost:5000")
})

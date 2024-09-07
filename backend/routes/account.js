import { Router } from "express";
import { User,Account } from "../db.js";
import authMiddleware from "../middlewares/auth.js";
import mongoose from "mongoose";
const accountRouter = Router()

accountRouter.get("/balance",authMiddleware, async (req, res)=>{
    const result = await Account.find({
        userId: req.userId
    })
    const balance = result[0].balance
    res.json({balance})
})

accountRouter.post('/transfer',authMiddleware, async (req, res)=>{
    const session = await mongoose.startSession();
    (await session).startTransaction
    const {amount, transferTo} = req.body;
    const user = await Account.find({userId: req.userId}).session(session)
    if(user[0].balance<amount){
        return res.status(500).json({message: "Insufficient Balance"})
    }
    const transferUser = await Account.find({userId: transferTo}).session(session);
    if(!transferUser){
        session.abortTransaction()
        return res.status(404).json({message: "User not found"})
    }
    await Account.updateOne({userId: req.userId}, {$inc:{balance: -amount}}).session(session)
    await Account.updateOne({userId: transferTo}, {$inc:{balance: amount}}).session(session)
    ;(await session).commitTransaction
    res.json({message: "Transaction Successful"})
    ;(await session).endSession
})


export default accountRouter
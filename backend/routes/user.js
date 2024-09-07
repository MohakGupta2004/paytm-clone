import { Router } from "express";
import jwt from "jsonwebtoken";
import z from "zod";
import { Account, User } from "../db.js";
import authMiddleware from "../middlewares/auth.js";
import bcrypt, { hash } from "bcrypt";
const userRouter = Router();
const stringSchema = z.string();
const updateBody = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

userRouter.post("/signup", async (req, res) => {
  const username = stringSchema.parse(req.body.username);
  const password = stringSchema.parse(req.body.password);
  const firstName = stringSchema.parse(req.body.firstName);
  const lastName = stringSchema.parse(req.body.lastName);

  const user = await User.findOne({ username });
  if (user) {
    res.json({ message: "Email Already Taken" });
  } else {
    await bcrypt.hash(password, 10, async (err, hashedPassword) => {
      console.log(hashedPassword);
      const result = await User.create({
        username,
        password: hashedPassword,
        firstName,
        lastName,
      });
      const userId = result._id;
      const balance = await Account.create({userId, balance: Math.floor((Math.random()+1) * 1000) });
      const token = jwt.sign({
        userId
    }, process.env.JWT_SECRET);
      res.send({ message: "Signed Up", userId: userId , balance: balance.balance, token});
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  const username = stringSchema.parse(req.body.username);
  const password = stringSchema.parse(req.body.password);
  const userFound = await User.findOne({ username });
  if (!userFound) {
    res.json({ message: "User not found" });
  }
  const passwordMatch = bcrypt.compare(password, userFound.password);
  if (!passwordMatch) {
    res.json({ message: "Invalid Password" });
  }
  const token = jwt.sign({ userId: userFound._id }, process.env.JWT_SECRET);
  res.json({ message: "Login Successful", token });
});

userRouter.put("/", authMiddleware, async (req, res) => {
  console.log(req.userId);

  // Validate the request body using zod schema
  const { success, data } = updateBody.safeParse(req.body);
  console.log(data);

  if (success) {
    try {
      // Correct updateOne syntax: First argument is the filter, second is the update operation
      const result = await User.updateOne({ _id: req.userId }, { $set: data });

      // Check if the update was applied
      if (result.modifiedCount === 0) {
        return res.status(400).json({ message: "No updates applied" });
      }

      console.log(result);
      res.json({ message: "User Updated" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(400).json({ message: "Invalid request body" });
  }
});

userRouter.get("/bulk",authMiddleware, async (req, res) => {
  const filter = req.query.filter || "";
  console.log(req.userId)
  const result = await User.find({
    _id:{$ne: req.userId},
    $or: [
      { firstName: { $regex: ".*" + filter + ".*" } },
      { lastName: { $regex: ".*" + filter + ".*" } },
    ],
  });
  res.json({
    user: result.map((user) => ({
      id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    })),
  });
});

export default userRouter;

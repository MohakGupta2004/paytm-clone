import mongoose from "mongoose";

// Database connection function with error handling
const connectDB = async () => {
  try {
    // MongoDB connection with necessary options for production
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    // Graceful exit if unable to connect to DB
    process.exit(1);
  }
};

// User Schema with validations
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,  // Ensures unique usernames
    trim: true,  // Remove leading/trailing spaces
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  firstName: {
    type: String,
    required: [true, "First Name is required"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
    trim: true,
  },
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

// Add an index on the username for faster queries
userSchema.index({ username: 1 });

// Account Schema with foreign key reference to the User schema
const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,  // Ensures account must be linked to a user
  },
  balance: {
    type: Number,
    required: [true, "Balance is required"],
    min: [0, "Balance cannot be negative"],  // Validation for non-negative balance
  },
}, { timestamps: true });

// User and Account models
export const User = mongoose.model("User", userSchema);
export const Account = mongoose.model("Account", accountSchema);

// Export the connection function
export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/express-mongo", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to MongoDB.");
    })
    .catch((err) => {
      console.error("Connection error", err);
      process.exit();
    });
};

export default connectDB;

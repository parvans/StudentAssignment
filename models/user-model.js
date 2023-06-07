import mongoose from "mongoose";


export const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength:8
    },
    isFaculty: {
        type: Boolean,
        default: false,
    }
  },{
    timestamps:true
  })
);

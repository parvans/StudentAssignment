import { User } from "../models/user-model.js";
import { comparePassword, hashPassword } from "../utilities/bcrypt.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();    
export const userRegister = async (req, res) => {
  const { name, email, password } = req.body;
  const exUser = await User.findOne({ email });
  if (exUser) return res.status(400).json({ message: "User already exists" });
  const hash = await hashPassword(password);
  const user = new User({
    name,
    email,
    password: hash,
  });
  await user.save();
  res.status(200).json({message:"User registered successfully"});
};

export const userLogin = async (req, res) => {
    const { email, password } = req.body;
    const userAvail=await User.findOne({email});
    if(!userAvail) return res.status(400).json({message:"User does not exist"});
    await comparePassword(password,userAvail.password).then((result)=>{
        if(!result) return res.status(400).json({message:"Password does not match"});
        const token=jwt.sign({_id:userAvail._id},process.env.JWT_SECRET,{expiresIn:"1d"});
        res.header("x-auth-token",token).json({message:"User logged in successfully",token:token});
    }).catch((err)=>{
        res.status(400).json({ message: err.message });
    });
};
    

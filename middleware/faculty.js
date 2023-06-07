import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user-model.js';
dotenv.config();

async function faculty(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({message:'Access denied. No token provided.'});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.faculty = decoded;
        const faculty = await User.findById(req.faculty._id);
        if (!faculty.isFaculty) return res.status(403).json({message:'Access denied.'});
        next();
    } catch (ex) {
        res.status(400).json({message:'Invalid token.'});
    }
}

export default faculty;
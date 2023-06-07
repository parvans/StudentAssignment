import mongoose from "mongoose";

export const HomeWork = mongoose.model(
  "HomeWork",
  new mongoose.Schema(
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
      },
        answers: [
            {
                question:{
                    type:String,
                    required:true
                },
                answer: {
                    type: String,
                    required: true,
                },
                mark:{
                    type:Number,
                    default:0
                }
            }
        ],
        totalMark: {
            type: Number,
            default: 0,
        }
    },
    {
      timestamps: true,
    }
  )
);

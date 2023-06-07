import mongoose from "mongoose";

export const Assignment = mongoose.model(
  "Assignment",
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      questions: [
        {
          question: {
            type: String,
            required: true,
          },
          options: [
            {
              optionNo: {
                type: Number,
                required: true,
              },
              option: {
                type: String,
                required: true,
              },
            },
          ],
          answer: {
            type: String,
            required: true,
          },
          mark:{
              type:Number,
              default:1
          }
        },
      ],
      totalMark: {
        type: Number,
        default: 0,
      },
        faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        }
    },
    {
      timestamps: true,
    }
  )
);

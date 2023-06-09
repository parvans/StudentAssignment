import mongoose from "mongoose";

export const Assignment = mongoose.model(
  "Assignment",
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      subject: {
        type: String,
        required: true,
      },
      questions: [
        {
          questionNo: {
            type: Number,
            required: true,
            default: 0,
          },
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
          mark: {
            type: Number,
            default: 1,
          },
        },
      ],
      totalMark: {
        type: Number,
        default: 0,
      },
      faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      attendedStudents: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "HomeWork",
        },
      ]
    },
    {
      timestamps: true,
    }
  )
);

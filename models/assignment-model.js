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
          // marks:{
          //     type:Number,
          //     required:true
          // }
        },
      ],
      totalMark: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  )
);

import { Assignment } from "../models/assignment-model.js";
import { User } from "../models/user-model.js";

export const newAssignment = async (req, res) => {
  const faculty = await User.findById(req.user._id);
  const exAssignment = await Assignment.findOne({ title: req.body.title });
  if (exAssignment)return res.status(400).json({ message: "An assignment with this title already exists" });
  if (!faculty.isFaculty)
    return res.status(403).json({ message: "Access denied." });
  const assignment = new Assignment(req.body);
  const result = await assignment.save();
  const updatedAssignment = await Assignment.findByIdAndUpdate(
    result._id,
    {
      faculty: req.user._id,
      totalMark: assignment.questions.reduce(
        (total, question) => total + question.mark,
        0
      ),
    },
    { new: true }
  );
  res.status(200).json({ message: "Assignment created successfully" });
};

export const allAssignments = async (req, res) => {
  const assignments = await Assignment.find();
  res.status(200).json(assignments);
};

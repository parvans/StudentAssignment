import { Assignment } from "../models/assignment-model.js";
import { User } from "../models/user-model.js";

export const newAssignment = async (req, res) => {
  const faculty = await User.findById(req.user._id);
  const exAssignment = await Assignment.findOne({ title: req.body.title });
  if (exAssignment)
    return res
      .status(400)
      .json({ message: "An assignment with this title already exists" });
  if (!faculty.isFaculty)
    return res.status(403).json({ message: "Access denied." });
  const assignment = new Assignment(req.body);
  const result = await assignment.save();
  const updatedAssignment = await Assignment.findByIdAndUpdate(
    result._id,
    {
      faculty: req.user._id,
      questions: req.body.questions.map((question) => {
        return {
          questionNo: req.body.questions.indexOf(question) + 1,
          question: question.question,
          options: question.options,
          answer: question.answer,
          mark: question.mark,
        };
      }),
      totalMark: assignment.questions.reduce(
        (total, question) => total + question.mark,
        0
      ),
    },
    { new: true }
  );
  res.status(200).json({ message: "Assignment created successfully" });
};

export const allAssigns = async (req, res) => {
  
  const userId = req.user._id;
  const checkUser=await User.findOne({_id:userId,isFaculty:true});
 let assign
  if(checkUser){
    assign = await Assignment.find()
  }else{
    assign = await Assignment.find().select("questions.question title totalMark faculty questions.options")
  }
  res.status(200).json(assign);
};

export const getAssign = async (req, res) => {
  const assign = await Assignment.findById(req.params.id);
  if (!assign)return res.status(404).json({ message: "Assignment not found" });
  res.status(200).json(assign);
}
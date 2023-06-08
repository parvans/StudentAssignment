import { Assignment } from "../models/assignment-model.js";
import { HomeWork } from "../models/homework-model.js";
import { User } from "../models/user-model.js";

export const attentAssignment = async (req, res) => {
    const userId=req.user._id;
    const student=await User.findOne({_id:userId,isFaculty:false});
    if(!student) return res.status(403).json({message:"Access denied"});
    const assignment = await Assignment.findById(req.params.id);
    if(!assignment) return res.status(404).json({message:"Assignment not found"});
    const exAssignment = await HomeWork.findOne({assignmentId:req.params.id,studentId:userId});
    if(exAssignment) return res.status(400).json({message:"You have already submitted this assignment"});
    const questions=assignment.questions.map(question=>{
        return {
            question:question.question,
            options:question.options
        }
    })
    // console.log(questions);
    // res.status(200).send(questions);
    const newHomeWork = new HomeWork({
        studentId:userId,
        assignmentId:req.params.id,
        answers:questions.map(question=>{
            return {
                question:question._id,
                // answer:req.body,
            }
        })
    })
    const result=await newHomeWork.save();
    
    // result.answers.map(async (answer)=>{
    //     const question=assignment.questions.find(question=>question.question===answer.question);
    //     if(question.answer===answer.answer){
    //         const updatedHomeWork=await HomeWork.findByIdAndUpdate(result._id,{
    //             $inc:{totalMark:question.mark}
    //         },{new:true});
    //     }
    //     console.log(question);
    // })

    result.answers.map(async (answer)=>{
        const question=assignment.questions.find(question=>question._id==answer.question);
        if(question.answer===answer.answer){
            const updatedHomeWork=await HomeWork.findByIdAndUpdate(result._id,{
                $inc:{totalMark:question.mark}
            },{new:true});
        }
        // console.log(question);
    })
    
    res.status(200).json({message:"Assignment submitted successfully"});

}

export const getAllHomeWork = async (req, res) => {
    const getAllHomeWork = await HomeWork.find()
    res.status(200).json(getAllHomeWork);
}
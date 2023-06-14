import { Assignment } from "../models/assignment-model.js";
import { HomeWork } from "../models/homework-model.js";
import { User } from "../models/user-model.js";
import fs from 'fs'
import path from "path";
import options from '../helpers/options.js'
import pdf from "pdf-creator-node";
import QuickChart from "quickchart-js";
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
            options:question.options,
        }
    })

    // adding the questions to the homework
    const newHomeWork = new HomeWork({
        studentId:userId,
        assignmentId:req.params.id,
        answers:questions.map(question=>{
            return {
                questNo:questions.indexOf(question)+1,
            }
        })
    })
    const result=await newHomeWork.save();

    // adding the student's answer to the homework
    result.answers.map(async (items)=>{
        const update=await HomeWork.findByIdAndUpdate(result._id,{
            $set:{
                [`answers.${items.questNo-1}.answer`]:req.body.answers[items.questNo-1]?.answer
            }
        },{new:true});

    })

    // checking the answers and calculating the total mark
    
    const updatedHomeWork=await HomeWork.findById(result._id);
    updatedHomeWork.answers.map(async (answer)=>{
        let incorrect=false
        const question=assignment.questions.find(question=>question.questionNo===answer.questNo);
        if(answer.answer===""){
            const updatedHomeWork=await HomeWork.findByIdAndUpdate(result._id,{
                $set:{[`answers.${answer.questNo-1}.mark`]:0}
            },{new:true});
        }
        if(question?.answer===answer.answer){
            const updatedHomeWork=await HomeWork.findByIdAndUpdate(result._id,{
                $inc:{totalMark:question?.mark}
            },{new:true});
            incorrect=true
        }
        if(!incorrect){
            const updatedHomeWork=await HomeWork.findByIdAndUpdate(result._id,{
                $inc:{totalMark:0}
            },{new:true});
        }
    })
    
    const updateAssign=await Assignment.findByIdAndUpdate(req.params.id,{
        $push:{attendedStudents:result._id}
    },{new:true});

    
    res.status(200).json({message:"Assignment submitted successfully"});

}

export const getAllHomeWork = async (req, res) => {
    const getAllHomeWork = await HomeWork.find().populate('studentId','name').populate('assignmentId');
    res.status(200).json(getAllHomeWork);
}

export const getAStudentHomeWork = async (req, res) => {
    const userId=req.user._id;
    const user=await User.findOne({_id:userId,isFaculty:true});
    if(!user) return res.status(403).json({message:"Access denied"});
    const getAAssign=await HomeWork.findOne({assignmentId:req.params.id,studentId:req.query.id}).populate("assignmentId",'-attendedStudents')
    if(!getAAssign) return res.status(404).json({message:"Assignment not found with this student"});
    res.status(200).json(getAAssign);
}

export const getStuAttHomeWork = async (req, res) => {
    const userId=req.user._id;
    const stuDent=await User.findOne({_id:userId});
    if(!stuDent) return res.status(403).json({message:"Student not found"});
    const getAAssign=await HomeWork.find({studentId:userId}).populate("assignmentId",'-attendedStudents')
    if(!getAAssign) return res.status(404).json({message:"This student has not attended any assignment"});
    res.status(200).json(getAAssign);
}
export const getStuPertiAttHomeWork = async (req, res) => {
    const userId=req.user._id;
    const stuDent=await User.findOne({_id:userId});
    if(!stuDent) return res.status(403).json({message:"Student not found"});
    const getAAssign=await HomeWork.findOne({studentId:userId,assignmentId:req.params.id}).populate("assignmentId",'-attendedStudents')
    if(!getAAssign) return res.status(404).json({message:"This student has not attended this assignment"});
    res.status(200).json(getAAssign);
}

export const getAllStuPdf = async (req, res) => {
    const sub=req.query.sub;
    const assign=req.query.assign;
    const studentId=req.query.id;
    let arr=[];
    let getAllHome=await HomeWork.find().populate("assignmentId",'-attendedStudents').populate("studentId")
    const __dirname=path.resolve();
    const html=fs.readFileSync(path.join(__dirname,'./view/students.html'),'utf-8');
    const fileName="doc_"+Math.random()+'.pdf';
    const filePath=path.join('./data',fileName);

    if(sub){
        let subFound=false;
        getAllHome.map((data)=>{
            if(data.assignmentId.subject==sub){
                arr.push(data);
                subFound=true;
            }
        })
        if(!subFound) return res.status(404).json({message:"No data found"});
    }else if (assign){
        let assignFound=false;
        getAllHome.map((data)=>{
            if(data.assignmentId.title==assign){
                arr.push(data);
                assignFound=true;
            }
        })
        if(!assignFound) return res.status(404).json({message:"No data found"});
    }else if(studentId){
        let studentFound=false;
        getAllHome.map((data)=>{
            if(data.studentId._id==studentId){
                arr.push(data);
                studentFound=true;
            }
        })
        if(!studentFound) return res.status(404).json({message:"No data found"});
    }else{
        arr=getAllHome;
    }

    
    //chart data
    const myChart = new QuickChart();
    myChart.setConfig({
        type: 'bar',
        data: {
            labels: arr.map((data)=>{
                return data.studentId.name +" / "+data.assignmentId.title;
            }),
            datasets: [{
                label: 'Student Mark',
                data: arr.map((data)=>{
                    return data.totalMark;
                }),
                backgroundColor: 'blue'
            },{
                label: 'Assignment Mark',
                data: arr.map((data)=>{
                    return data.assignmentId.totalMark;
                }),
                backgroundColor: 'red'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: 30,
                    }
                }]
            }
        }
        
  
    }).setWidth(1000).setHeight(400).setBackgroundColor('transparent');
    const chartUrl = await myChart.getShortUrl();
    const document={
            html:html,
            data:{
                    students:arr.map((data)=>{
                        return {
                            student:data.studentId.name,
                            subject:data.assignmentId.subject,
                            assignment:data.assignmentId.title,
                            totalMark:data.assignmentId.totalMark,
                            studentMark:data.totalMark,
                        }
                    }),
                    chartUrl:chartUrl
            },
            path:filePath,
        };

        pdf.create(document,options).then((ress)=>{
            console.log(ress);
            res.sendFile(ress.filename);
        }
        ).catch((error)=>{
            console.log(error);
        })

        // res.status(200).json({message:"Pdf created successfully"});
        // res.sendFile(filePath);

}    


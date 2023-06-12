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
    // console.log(questions);
    // res.status(200).send(questions);
    const newHomeWork = new HomeWork({
        studentId:userId,
        assignmentId:req.params.id,
        answers:questions.map(question=>{
            return {
                questNo:questions.indexOf(question)+1,
                // answer:req.body,
            }
        })
    })
    const result=await newHomeWork.save();

    // adding the student's answer to the homework
    result.answers.map(async (answer)=>{
        const update=await HomeWork.findByIdAndUpdate(result._id,{
            $set:{
                [`answers.${answer.questNo-1}.answer`]:req.body.answers[answer.questNo-1]?.answer
            }
        },{new:true});

    })

    const updatedHomeWork=await HomeWork.findById(result._id);
    updatedHomeWork.answers.map(async (answer)=>{
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
        }else{
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
    const getAllHomeWork = await HomeWork.find()
    res.status(200).json(getAllHomeWork);
}

export const getAStudentHomeWork = async (req, res) => {
    const userId=req.user._id;
    const user=await User.findOne({_id:userId,isFaculty:true});
    if(!user) return res.status(403).json({message:"Access denied"});
    const getAAssign=await HomeWork.findOne({assignmentId:req.params.id,studentId:req.query.id}).populate("assignmentId")
    if(!getAAssign) return res.status(404).json({message:"Assignment not found with this student"});
    res.status(200).json(getAAssign);
}

export const getStuAttHomeWork = async (req, res) => {
    const userId=req.user._id;
    const stuDent=await User.findOne({_id:userId});
    if(!stuDent) return res.status(403).json({message:"Student not found"});
    const getAAssign=await HomeWork.find({studentId:userId}).populate("assignmentId")
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

// export const stuToPdf = async (req, res) => {
//     const userId=req.user._id;
//     const student=await User.findOne({_id:userId,isFaculty:false});
//     const getAAssign=await HomeWork.find({studentId:userId,assignmentId:req.params.id}).populate("assignmentId",'-attendedStudents').populate("studentId")
// // Create a document
// const doc = new PDFDocument();
//   // Saving the pdf file in root directory.
//   const time=new Date().getTime();
// doc.pipe(fs.createWriteStream(`./data/${student.name}${time}.pdf`));


// // doc.fontSize(15).text(`Student Name: ${student.name}`, 100, 100).fillColor('black');
// getAAssign.map((assignment)=>{
//     doc.fontSize(25).text(`${assignment.assignmentId.title}`, 100, 100).fillColor('yellow');
//     // doc.fontSize(15).text(`Student Name: ${assignment.studentId.name}`, 200, 200).fillColor('black');
//     // doc.fontSize(15).text(`Total Mark: ${assignment.assignmentId.totalMark}`, 100, 100).fillColor('black');
// })
// console.log(getAAssign);

// // Finalize PDF file
// doc.end();

// res.status(200).json({message:"Pdf created successfully"});
// }


// export const generatePdf = async (req, res) => {
//     const studentId=req.query.id;
//     const assignmentId=req.params.id;
//     const __dirname=path.resolve();
//     const html=fs.readFileSync(path.join(__dirname,'./view/template.html'),'utf-8');
//     const fileName=Math.random()+"_doc"+'.pdf';
//     const filePath=path.join('./data',fileName);
//     const getStudetAsssign=await HomeWork.findOne({studentId:studentId,assignmentId:assignmentId}).populate("assignmentId",'-attendedStudents').populate("studentId")

//     // console.log(getStudetAsssign.assignmentId.questions);
//     const document={
//             html:html,
//             data:{
//                     student:getStudetAsssign.studentId.name,
//                     subject:getStudetAsssign.assignmentId.subject,
//                     assignment:getStudetAsssign.assignmentId.title,
//                     totalMark:getStudetAsssign.assignmentId.totalMark,
//                     studentMark:getStudetAsssign.totalMark+" / "+getStudetAsssign.assignmentId.totalMark,
//                     questions:getStudetAsssign.assignmentId.questions.map((question)=>{
//                         return {
//                             question:question.question,
//                             mark:question.mark,
//                             currectAnswer:question.answer,
//                         }
//                     }),
//                     answers:getStudetAsssign.answers.map((answer)=>{
//                         return {
//                             question:answer.questNo,
//                             answer:answer.answer,
//                         }
//                     })
//             },
//             path:filePath,
//         };


//         pdf.create(document,options).then((res)=>{
//             console.log(res);
//         }).catch((error)=>{
//             console.log(error);
//         })
            
//             res.status(200).json({message:"Pdf created successfully"});
//             // res.status(200).json(getStudetAsssign);

// }

export const getAllStuPdf = async (req, res) => {
    const sub=req.query.sub;
    const assign=req.query.assign;
    let arr=[];
    let getAllHome;
    const __dirname=path.resolve();
    const html=fs.readFileSync(path.join(__dirname,'./view/students.html'),'utf-8');
    const fileName=Math.random()+"doc"+'.pdf';
    const filePath=path.join('./data',fileName);

    if(sub){
        getAllHome=await HomeWork.find().populate("assignmentId",'-attendedStudents').populate("studentId")
        getAllHome.map((data)=>{
            if(data.assignmentId.subject==sub){
                arr.push(data);
            }
        })
    }else if (assign){
        getAllHome=await HomeWork.find().populate("assignmentId",'-attendedStudents').populate("studentId")
        getAllHome.map((data)=>{
            if(data.assignmentId.title==assign){
                arr.push(data);
            }
        })
    }else{
        getAllHome=await HomeWork.find().populate("assignmentId",'-attendedStudents').populate("studentId")
        arr=getAllHome;
    }
    // const getAllHome=await HomeWork.find().populate("assignmentId",'-attendedStudents').populate("studentId")

    
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
                        max: 50,
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

        pdf.create(document,options).then((res)=>{
            console.log(res);
        }
        ).catch((error)=>{
            console.log(error);
        })

        res.status(200).json({message:"Pdf created successfully"});

}    


import express from "express";
import bodyParser from "body-parser";
import connectDB from "./db/db.js";
import userRoute from "./routes/user.routes.js";
import assignRoute from "./routes/assign.routes.js";
import studentRoute from "./routes/homework.routes.js";
import path from 'path'
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, 'public')))
app.get("/", (req, res) => {
  res.send("Hello World!");
});

connectDB()
app.use('/api/user',userRoute)
app.use('/api/assignment',assignRoute)
app.use('/api/student',studentRoute)
const PORT = process.env.PORT || 6060;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
  // console.log(`http://localhost:${PORT}`);
});

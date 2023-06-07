import express from "express";
import bodyParser from "body-parser";
import connectDB from "./db/db.js";
import userRoute from "./routes/user.routes.js";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

connectDB()
app.use('/api/user',userRoute)
const PORT = process.env.PORT || 6060;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
//   console.log(`http://localhost:${PORT}`);
});

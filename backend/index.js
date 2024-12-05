require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const authRoutes = require("./Routes/auth-routes/index");
const mediaRoutes = require("./Routes/instructor-routes/media-routes");
const studentCourse = require("./Routes/student-routes/course-routes")
const instructorCourseRoutes = require("./Routes/instructor-routes/course-routes");
const coursedetailsRoute = require('./Routes/student-routes/course-routes');
const CoursePage = require("./Routes/student-routes/coursePage-route");
//const { default: CoursePage } = require("../my-app/src/Components/CoursePage");
const quizRoutes = require('./Routes/instructor-routes/quiz-routes');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
}));



//database connection
mongoose
.connect(process.env.MONGO_URL)
.then(() => console.log("mongodb is connected"))
.catch((e) => console.log(e));






app.use(express.json());
  
//routes

app.use("/student/course",studentCourse)
app.use("/apix",CoursePage)
app.use("/auth", authRoutes);
app.use('/api/coursedetails', coursedetailsRoute);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/instructor/quiz/add", quizRoutes);

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
});
  
  app.listen(PORT, () => {
    console.log(`Server is now running on port http://localhost:${PORT}`);
  });

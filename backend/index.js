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

// app.use(cors({
//   origin: 'http://localhost:3000', 
//   origin: 'https://learn-it-online-learning-portal.vercel.app', 
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));


//database connection
mongoose.connect('mongodb+srv://parvpatel20804:Parv1234@cluster0.fw8ji.mongodb.net/learnit', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((error) => console.log('MongoDB connection error: ', error));






app.use(express.json());
  
//routes

app.use("/student/course",studentCourse)
app.use("/apix",CoursePage)
app.use("/auth", authRoutes);
app.use('/api/coursedetails', coursedetailsRoute);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/instructor/quiz", quizRoutes);

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

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import CoursesCatalog from "./Components/CourseCatalog";
import Popup from "./Components/Popup";
import "./App.css";
import CreateCourse from "./Components/CreateCourse";
import FeedbackPage from "./Components/FeedbackPage";
import CoursePage from "./Components/CoursePage";
import CreateQuiz from "./Components/CreateQuiz";
import HomePage from "./Pages/General/HomePage";
import InstructorDashboardPage from "./Pages/Instructor/InstructorDashboardPage";
import SturdentProfilePage from "./Pages/Student/StudentProfilePage";
import EditProfilePage from "./Pages/General/EditProfilePage";
import SearchPage from "./Pages/General/SearchPage";
import BuyNowPage from "./Components/BuyNow"; 
import StartLearningPage from "./Components/StartLearning";
import EditCourse from './Components/EditCourse.js';
import Headeraftersignin from './Components/HeaderAfterSignIn.js';
import EditQuiz from "./Components/EditQuiz.js";
import { Login } from "@mui/icons-material";
import Profile from "./Components/StudentProfile.js";

function App() {
  return (
    <div className="app">

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/learnCourse/:id" element={<CoursePage />} />
        <Route path="/instructor-dashboard" element={<InstructorDashboardPage />} />
         <Route path="/create-course" element={
          <> <Header />
            <CreateCourse />
            <Footer />
          </>} /> 
        <Route path="/profile" element={<SturdentProfilePage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/search-courses" element={<SearchPage />} />
        <Route path="/create-quize" element={<CreateQuiz />} />
        <Route path="/course/:id" element={<EditCourse />} />
        <Route path="/buy-now/:id" element={<BuyNowPage />} />
        <Route path="/start-learning/:id" element={<StartLearningPage />} />
        <Route path="/edit-quiz/:id" element={<EditQuiz />} />
      </Routes>   

    </div>
  );
}
export default App;
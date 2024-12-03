import React, { useState, useEffect } from "react";
import "./Styles/CoursePage.css";
import { ExpandMore, ArrowBack, ArrowForward } from "@mui/icons-material";
import { Collapse, Pagination } from "@mui/material";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { IconButton } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useNavigate, useParams } from "react-router-dom";

function CoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [completedLessons, setCompletedLessons] = useState([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [openModules, setOpenModules] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [quizPage, setQuizPage] = useState(1);
  const [showQuizFinalResults, setShowQuizFinalResults] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  const [modules1, setModules] = useState([]); // Stores the course curriculum (modules)
  const [loading, setLoading] = useState(true); // Indicates if data is being loaded
  const [error, setError] = useState(null); // Stores any error message during API fetching

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/api/coursedetails/${id}`
        );
        const data = await response.json();
        setModules(data.curriculum || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const totalLessons = modules1.reduce(
    (acc, module) => acc + (module.items?.length || 0),
    0
  );
  const progressPercentage = Math.round(
    (completedLessons.length / totalLessons) * 100
  );

  const currentLesson =
    modules1[currentModuleIndex]?.items?.[currentLessonIndex] || null;

  const markAsComplete = () => {
    const lessonKey = `${currentModuleIndex}-${currentLessonIndex}`;
    if (!completedLessons.includes(lessonKey)) {
      setCompletedLessons([...completedLessons, lessonKey]);
    }
  };

  const navigateNext = () => {
    if (
      currentLessonIndex <
      (modules1[currentModuleIndex]?.items?.length || 0) - 1
    ) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentModuleIndex < modules1.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentLessonIndex(0);
    }
  };

  const navigatePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      setCurrentLessonIndex(
        (modules1[currentModuleIndex - 1]?.items?.length || 1) - 1
      );
    }
  };

  const toggleModule = (index) => {
    setOpenModules((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleLessonClick = (moduleIndex, lessonIndex) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentLessonIndex(lessonIndex);
    setQuizPage(1);
    setShowQuizFinalResults(false);
    setShowAnswers(false);
    setShowInstructions(true);
  };

  const renderQuizResponses = () => {
    if (!showAnswers) return null;
    const correctAnswers = quizResults;
    const totalQuestions = currentLesson.quiz.questions.length;
    const percentage = (correctAnswers / totalQuestions) * 100;
    return (
      <div className="quiz-answer">
        <div className="progress-circle">
          <CircularProgressbar
            value={percentage}
            text={`${quizResults}/${totalQuestions}`}
            styles={buildStyles({
              pathColor: percentage >= 80 ? "green" : "red",
              textColor: percentage >= 80 ? "green" : "red",
            })}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!modules1.length) {
    return <div>No modules available for this course.</div>;
  }

  return (
    <div className="course-page">
      <div className="course-header">
        <div className="back-button" onClick={() => window.history.back()}>
          <ArrowBack />
        </div>
        <div className="header-title">Introduction LearnPress – LMS Plugin</div>
      </div>
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="course-container">
        <div className="course-sidebar">
          <h2>Curriculum</h2>
          {modules1.map((module, moduleIndex) => (
            <div key={moduleIndex} className="module">
              <h3 onClick={() => toggleModule(moduleIndex)}>
                {module.title}
                <ExpandMore
                  className="dropdown-icon"
                  style={{
                    transform: openModules.includes(moduleIndex)
                      ? "rotate(180deg)"
                      : "",
                  }}
                />
              </h3>
              <Collapse in={openModules.includes(moduleIndex)}>
                <ul>
                  {module.items?.map((lesson, lessonIndex) => {
                    const lessonKey = `${moduleIndex}-${lessonIndex}`;
                    return (
                      <li
                        key={lessonIndex}
                        className={`lesson ${
                          completedLessons.includes(lessonKey)
                            ? "completed"
                            : ""
                        }`}
                        onClick={() =>
                          handleLessonClick(moduleIndex, lessonIndex)
                        }
                      >
                        <span>{lesson.title}</span>
                        {lesson.type === "video" && (
                          <IconButton
                            color="primary"
                            onClick={() =>
                              window.open(
                                `/download-pdf/${moduleIndex}`,
                                "_blank"
                              )
                            }
                            title="Download PDF"
                            size="small"
                            sx={{
                              marginLeft: "auto",
                              color: "#ff9100",
                              marginRight: "7px",
                            }}
                          >
                            <PictureAsPdfIcon />
                          </IconButton>
                        )}
                        <span className="lesson-time">{lesson.time}</span>
                      </li>
                    );
                  })}
                </ul>
              </Collapse>
            </div>
          ))}
        </div>
        <div className="course-content">
          {currentLesson ? (
            <>
              <h2>{currentLesson.title}</h2>
              {/* Add content rendering for lessons */}
            </>
          ) : (
            <div>Select a lesson to start learning.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursePage;

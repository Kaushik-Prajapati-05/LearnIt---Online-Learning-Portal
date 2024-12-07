import React, { useState, useEffect } from "react";
import "./Styles/CoursePage.css";
import { ExpandMore, ArrowBack, ArrowForward } from "@mui/icons-material";
import { Collapse, Pagination } from "@mui/material";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { IconButton } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useNavigate, useParams } from "react-router-dom";
import Header2 from "./HeaderAfterSignIn";
import Footer from "./Footer"
import axios from "axios";
const ENDPOINT = process.env.BACKEND_URL || "http://localhost:8000";


function CoursePage() {
  const { id } = useParams();
  const { quizId } = useParams();
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
  const [pdf, setPdf] = useState("");
  const [video, setVideo] = useState("");
  const [courseDetails, setCourseDetails] = useState([]); // Holds the course details fetched from the API
  const [quizDetails, setQuizDetails] = useState({
    quizTitle: '', // Initially set to empty or null
    passingScore: '', // Initially set to empty or null
    questions: [],
  });

  const [modules, setModules] = useState([
    {
      title: "LearnIt Getting Started",
      items: [
        { title: "What is Python", type: "video" },
        { title: "How to use python", type: "video" },
        {
          title: "Python Quiz",
          type: "quiz",
          quiz: {
            passingMarks: 2,
            questions: [
              {
                question: "What is Python?",
                options: [
                  "Programming Language",
                  "Markup Language",
                  "Assmbly Language",
                  "Low Level Language",
                ],
                correctAnswer: 0,
              },
              {
                question: "Which keyword is used to define a function in Python?",
                options: ["function", "void", "def", "define"],
                correctAnswer: 2,
              },
            ],
          },
        },
      ],
    }
  ]);

  // Stores the course curriculum (modules)

  const [loading, setLoading] = useState(true); // Indicates if data is being loaded
  const [error, setError] = useState(null); // Stores any error message during API fetching

  useEffect(() => {
    // const fetchQuizDetails = async () => {
    //   try {
    //     const response = await axios.get(`http://localhost:8000/student/course/quiz/${id}`);
    //     const { quizTitle, passingScore, questions } = response.data;
    //     console.log(response.data);
    //     setQuizDetails({ quizTitle, passingScore, questions });
    //     setLoading(false);
    //   } catch (err) {
    //     setError('Failed to fetch quiz details.');
    //     setLoading(false);
    //   }
    // };

    // fetchQuizDetails();
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`${ENDPOINT}/api/coursedetails/${id}`);
        const data = await response.json();
    
        // Define the dummy quiz data
        const quizData = {
          title: "Python Quiz",
          type: "quiz",
          quiz: {
            passingMarks: 2,
            questions: [
              {
                question: "What is Python?",
                options: [
                  "Programming Language",
                  "Markup Language",
                  "Assembly Language",
                  "Low Level Language",
                ],
                correctAnswer: 0,
              },
              {
                question: "Which keyword is used to define a function in Python?",
                options: ["function", "void", "def", "define"],
                correctAnswer: 2,
              },
            ],
          },
        };
    
        // Update the data by appending quizData to the items array of each module
        const updatedModules = data.module.map((module) => ({
          ...module,
          items: [...module.items, quizData],
        }));
    
        const pdf = data.others.curriculum[0].moduleContentUrl[0];
        setPdf(pdf);
    
        // Update course details with the modified data
        setCourseDetails({ ...data, module: updatedModules });
        setModules(updatedModules || []);
    
        // Safely get the first video URL
        const firstVideoUrl =
          updatedModules[0]?.items.find((item) => item.type === "video")?.link;
    
        if (firstVideoUrl) {
          setVideo(firstVideoUrl); // Update the video state
        }
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseDetails();
  }, [id]);

  console.log(modules[0].items[0].link);

  const totalLessons = modules.reduce(
    (acc, module) => acc + module.items.length,
    0
  );
  const progressPercentage = Math.round(
    (completedLessons.length / totalLessons) * 100
  );
  const currentLesson = modules[currentModuleIndex].items[currentLessonIndex];
  const markAsComplete = () => {
    const lessonKey = `${currentModuleIndex}-${currentLessonIndex}`;
    if (!completedLessons.includes(lessonKey)) {
      setCompletedLessons([...completedLessons, lessonKey]);
    }
  };
  const navigateNext = () => {
    if (currentLessonIndex < modules[currentModuleIndex].items.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentLessonIndex(0);
    }
  };
  const navigatePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      setCurrentLessonIndex(modules[currentModuleIndex - 1].items.length - 1);
    }
  };
  const handleLessonClick = (moduleIndex, lessonIndex) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentLessonIndex(lessonIndex);
    setQuizPage(1);
    setShowQuizFinalResults(false);
    setShowAnswers(false);
    setShowInstructions(true);
  };
  const toggleModule = (index) => {
    setOpenModules((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const handleQuizAnswer = (questionIndex, optionIndex) => {
    const lessonTitle = currentLesson.title;
    setQuizAnswers((prev) => ({
      ...prev,
      [lessonTitle]: {
        ...prev[lessonTitle],
        [questionIndex]: optionIndex,
      },
    }));
  };
  const calculateQuizResults = () => {
    const quiz = currentLesson.quiz;
    const answers = quizAnswers[currentLesson.title] || {};
    const correctAnswersCount = quiz.questions.filter(
      (q, i) => answers[i] === q.correctAnswer
    ).length;
    setQuizResults(correctAnswersCount);
    setShowQuizFinalResults(true);
    setShowAnswers(true);
    if (correctAnswersCount >= quiz.passingMarks) {
      markAsComplete();
    }
  };
  const handleQuizPageChange = (event, value) => {
    setQuizPage(value);
  };
  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizResults(null);
    setQuizPage(1);
    setShowQuizFinalResults(false);
    setShowAnswers(false);
    setShowInstructions(true);
  };
  const isLastLesson =
    currentModuleIndex === modules.length - 1 &&
    currentLessonIndex === modules[modules.length - 1].items.length - 1;
  const isFirstLesson = currentModuleIndex === 0 && currentLessonIndex === 0;
  const renderQuizResponses = () => {
    if (!showAnswers) return null;
    const correctAnswers = quizResults; // The number of correct answers
    const totalQuestions = currentLesson.quiz.questions.length;
    const percentage = (correctAnswers / totalQuestions) * 100; // Calculate percentage
    return (
      <div className="quiz-answer">
        {/* Circular Progress Bar for Quiz Results */}
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
  return (
    <><Header2 />
      <div className="course-header">
        <div className="back-button-2" onClick={() => window.history.back()}>
          <ArrowBack />
        </div>
        <div className="header-title"> {courseDetails.title || "Welcome to LearnIt"} </div>
      </div>
      <div className="course-page">

        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="course-container">
          <div className="course-sidebar">
            <h2>Curriculum</h2>
            {modules.map((module, moduleIndex) => (
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
                    {module.items.map((lesson, lessonIndex) => {
                      const lessonKey = `${moduleIndex}-${lessonIndex}`;
                      return (
                        <li
                          key={lessonIndex}
                          className={`lesson ${completedLessons.includes(lessonKey)
                            ? "completed"
                            : ""
                            }`}
                          onClick={() =>
                            handleLessonClick(moduleIndex, lessonIndex)
                          }
                        >
                          <span>{lesson.title}</span>
                          {/* Only show PDF button if the lesson is of type 'video' */}
                          {lesson.type === "video" && (
                            <IconButton
                              color="primary"
                              onClick={() =>
                                window.open(
                                  `${pdf}`,
                                  "_blank"
                                )
                              }
                              title="Download PDF"
                              size="small"
                              sx={{
                                marginLeft: "auto",
                                color: "#ff9100",
                                marginRight: "7px",
                              }} // Add custom styling
                            >
                              <PictureAsPdfIcon />
                            </IconButton>
                          )}

                        </li>
                      );
                    })}
                  </ul>
                </Collapse>
              </div>
            ))}

          </div>
          <div className="course-content">
            <h2>{currentLesson.title}</h2>
            {currentLesson.type === "video" && (
              <>
                <div className="video-container">
                  {/* <p>${currentLesson.title} content description...</p> */}
                  {currentLesson && currentLesson.link ? (
                    <video controls name="media">
                      <source src={currentLesson.link} type="video/mp4" />
                    </video>
                  ) : (
                    <p>Loading video...</p>
                  )}
                </div>
                <button className="complete-button" onClick={markAsComplete}>
                  Completed
                </button>
              </>
            )}

            {currentLesson.type === "quiz" && (
              <>
                {showInstructions ? (
                  <>
                    <h3>Quiz Instructions</h3>
                    <ul className="instruction-page">
                      <li>Read each question carefully.</li>
                      <li>
                        Select the most appropriate answer for each question.
                      </li>
                      <li>
                        You can navigate through questions using the pagination at
                        the bottom.
                      </li>
                      <li>
                        Once you've answered all questions, click "Submit Quiz" to
                        view results.
                      </li>
                    </ul>
                    <button
                      className="complete-button"
                      onClick={() => setShowInstructions(false)}
                    >
                      Start Quiz
                    </button>
                  </>
                ) : (
                  <>
                    {!showQuizFinalResults ? (
                      <>
                        <h3>
                          {currentLesson.quiz.questions[quizPage - 1].question}
                        </h3>
                        <ul className="quiz-options">
                          {currentLesson.quiz.questions[quizPage - 1].options.map(
                            (option, index) => (
                              <li
                                key={index}
                                onClick={() =>
                                  handleQuizAnswer(quizPage - 1, index)
                                }
                                className={`quiz-option ${quizAnswers[currentLesson.title]?.[
                                  quizPage - 1
                                ] === index
                                  ? "selected"
                                  : ""
                                  }`}
                              >
                                {option}
                              </li>
                            )
                          )}
                        </ul>
                        <Pagination
                          count={currentLesson.quiz.questions.length}
                          page={quizPage}
                          onChange={handleQuizPageChange}
                          color="primary"
                          sx={{
                            "& .MuiPaginationItem-text": {
                              color: "#ffffff", // Example color (Tomato) for text
                            },
                          }}
                        />
                        {quizPage === currentLesson.quiz.questions.length && (
                          <button
                            className="complete-button"
                            onClick={calculateQuizResults}
                          >
                            Submit Quiz
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <h3>Quiz Results</h3>
                        <p>
                          You answered {quizResults} out of{" "}
                          {currentLesson.quiz.questions.length} questions
                          correctly.
                        </p>
                        {renderQuizResponses()}{" "}
                        {/* Display student answers with feedback */}
                        {quizResults < currentLesson.quiz.passingMarks && (
                          <button className="complete-button" onClick={resetQuiz}>
                            Retake Quiz
                          </button>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
            <div className="navigation-buttons">
              <button
                onClick={navigatePrevious}
                className={`previous-button ${isFirstLesson ? "hidden" : ""}`}
              >
                <ArrowBack /> Previous
              </button>
              <button
                onClick={navigateNext}
                className={`next-button ${isLastLesson ? "hidden" : ""}`}
              >
                Next <ArrowForward />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
export default CoursePage;

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

  const [video,setVideo] = useState(""); 
  const [courseDetails, setCourseDetails] = useState([]); // Holds the course details fetched from the API
  const [modules, setModules] = useState([
    {
      title: "LearnPress Getting Started",
      items: [
        { title: "What is LearnPress?", type: "video", time: "20 minutes" },
        { title: "How to use LearnPress?", type: "video", time: "60 minutes" },
        {
          title: "Demo the Quiz of LearnPress",
          type: "quiz",
          time: "10 minutes",
          quiz: {
            passingMarks: 2,
            questions: [
              {
                question: "What is the primary purpose of LearnPress?",
                options: [
                  "Online Learning",
                  "Cooking",
                  "Shopping",
                  "Traveling",
                ],
                correctAnswer: 0,
              },
              {
                question: "What language is LearnPress built on?",
                options: ["JavaScript", "Python", "PHP", "Ruby"],
                correctAnswer: 2,
              },
              {
                question: "Who is LearnPress designed for?",
                options: [
                  "Bloggers",
                  "Educators",
                  "Gamers",
                  "Content Creators",
                ],
                correctAnswer: 1,
              },
            ],
          },
        },
      ],
    },
    {
      title: "LearnPress Live Course",
      items: [
        {
          title: "Demo Zoom Meeting Lesson",
          type: "video",
          time: "60 minutes",
        },
        { title: "Demo Google Meet Lesson", type: "video", time: "60 minutes" },
      ],
    },
  ]); // Stores the course curriculum (modules)
  const [loading, setLoading] = useState(true); // Indicates if data is being loaded
  const [error, setError] = useState(null); // Stores any error message during API fetching

  const modules1 = [
    {
      title: "LearnPress Getting Started",
      items: [
        { title: "What is LearnPress?", type: "video", time: "20 minutes" },
        { title: "How to use LearnPress?", type: "video", time: "60 minutes" },
        {
          title: "Demo the Quiz of LearnPress",
          type: "quiz",
          time: "10 minutes",
          quiz: {
            passingMarks: 2,
            questions: [
              {
                question: "What is the primary purpose of LearnPress?",
                options: [
                  "Online Learning",
                  "Cooking",
                  "Shopping",
                  "Traveling",
                ],
                correctAnswer: 0,
              },
              {
                question: "What language is LearnPress built on?",
                options: ["JavaScript", "Python", "PHP", "Ruby"],
                correctAnswer: 2,
              },
              {
                question: "Who is LearnPress designed for?",
                options: [
                  "Bloggers",
                  "Educators",
                  "Gamers",
                  "Content Creators",
                ],
                correctAnswer: 1,
              },
            ],
          },
        },
      ],
    },
    {
      title: "LearnPress Live Course",
      items: [
        {
          title: "Demo Zoom Meeting Lesson",
          type: "video",
          time: "60 minutes",
        },
        { title: "Demo Google Meet Lesson", type: "video", time: "60 minutes" },
      ],
    },
  ];
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/api/coursedetails/${id}`
        );
        const data = await response.json();
        console.log(data);
        setCourseDetails(data);
        setModules(data.module || []);
        setVideo(data.module[0].items[0].link)
        // setVideo(data.curriculum[1].moduleVideoUrl)
        // console.log(data.curriculum || [])
      } catch (err) {
        console.log(err)
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
                        {/* Only show PDF button if the lesson is of type 'video' */}
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
                            }} // Add custom styling
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
          <h2>{currentLesson.title}</h2>
          {currentLesson.type === "video" && (
            <>
              <p>{`${currentLesson.title} content description...`}</p>
              <video controls className="module-video">
                <source src={video} altr="adasd" type="video/mp4" />
              </video>
              <button className="complete-button" onClick={markAsComplete}>
                {/* Mark as complete */}
                {video}
                {/* {modules1[1].items.length ? modules1[1].items.link :"LLL" } */}
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
                      You need to answer at least{" "}
                      {currentLesson.quiz.passingMarks} questions correctly to
                      pass the quiz.
                    </li>
                    <li>
                      You can navigate through questions using the pagination at
                      the bottom.
                    </li>
                    <li>
                      Once you’ve answered all questions, click "Submit Quiz" to
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
                              className={`quiz-option ${
                                quizAnswers[currentLesson.title]?.[
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
  );
}
export default CoursePage;

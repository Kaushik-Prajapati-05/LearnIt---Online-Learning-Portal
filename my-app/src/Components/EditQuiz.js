import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  MenuItem,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { NavigateBefore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './Styles/EditQuiz.css';


const ENDPOINT= process.env.BACKEND_URL ||  "http://localhost:8000";

const EditQuiz = () => {
  const navigate = useNavigate();

  const [quizDetails, setQuizDetails] = useState({
    course: '', // Initially set to empty
    quiz: '', // Initially set to empty
    passingScore: '', // Initially set to empty or null
    quizzes: {
      'Course 1': [
        {
          quizName: 'Quiz 1',
          passingScore: 80, // Example passing score (can be replaced with a calculation)
          questions: [
            {
              questionText: 'What is React?',
              options: ['A library', 'A framework', 'A language', 'A tool'],
              correctAnswer: '0',
            },
          ],
        },
        {
          quizName: 'Quiz 2',
          passingScore: 85, // Example passing score
          questions: [
            {
              questionText: 'What is JSX?',
              options: ['A JavaScript extension', 'A CSS preprocessor', 'A HTML template', 'A library'],
              correctAnswer: '0',
            },
          ],
        },
      ],
      'Course 2': [
        {
          quizName: 'Quiz 1',
          passingScore: 75, // Example passing score
          questions: [
            {
              questionText: 'What is JavaScript?',
              options: ['A programming language', 'A framework', 'A library', 'A tool'],
              correctAnswer: '0',
            },
          ],
        },
      ],
    },
    questions: [],
  });

  const handleSelectCourse = (e) => {
    const selectedCourse = e.target.value;
    setQuizDetails((prev) => ({
      ...prev,
      course: selectedCourse,
      quiz: '', // Reset quiz
      passingScore: '', // Reset passing score when course changes
      questions: [],
    }));
  };

  const handleSelectQuiz = (e) => {
    const selectedQuiz = e.target.value;
    const selectedCourse = quizDetails.course;
    const quiz = quizDetails.quizzes[selectedCourse].find((q) => q.quizName === selectedQuiz);

    // Set the passing score based on the quiz data (e.g., 80% of the total number of questions or predefined value)
    const passingScore = quiz ? quiz.passingScore : '';

    setQuizDetails((prev) => ({
      ...prev,
      quiz: selectedQuiz,
      passingScore: passingScore, // Dynamically set the passing score from quiz data
      questions: quiz ? quiz.questions : [],
    }));
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
    };
    setQuizDetails((prev) => ({ ...prev, questions: [...prev.questions, newQuestion] }));
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = quizDetails.questions.filter((_, idx) => idx !== index);
    setQuizDetails((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...quizDetails.questions];
    updatedQuestions[index].questionText = value;
    setQuizDetails((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...quizDetails.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuizDetails((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleCorrectAnswerChange = (questionIndex, value) => {
    const updatedQuestions = [...quizDetails.questions];
    updatedQuestions[questionIndex].correctAnswer = value;
    setQuizDetails((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleSaveQuiz = () => {
    if (!quizDetails.passingScore || quizDetails.questions.length === 0) {
      alert('Please fill in all required fields.');
      return;
    }
    alert('Quiz saved successfully!');
    navigate('/instructor-dashboard');
  };

  useEffect(() => {
    const selectedCourse = quizDetails.course;
    const selectedQuiz = quizDetails.quiz;
    const quiz = quizDetails.quizzes[selectedCourse]?.find((q) => q.quizName === selectedQuiz);
    if (quiz) {
      setQuizDetails((prev) => ({
        ...prev,
        questions: quiz.questions,
      }));
    }
  }, [quizDetails.course, quizDetails.quiz]);

  return (
    <Box className="create-quiz-container">
      <div className="title">Edit Quiz</div>
        
    
        {/* Passing Score */}
        
          <TextField
            label="Passing Score (%)"
            variant="outlined"
            fullWidth
            type="number"
            value={quizDetails.passingScore}
            onChange={(e) =>
              setQuizDetails((prev) => ({
                ...prev,
                passingScore: e.target.value,
              }))
            }
            className="passing-score-input"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#ff9100' },
                '&:hover fieldset': { borderColor: '#ff5e00' },
                '&.Mui-focused fieldset': { borderColor: '#ff5e00' },
              },
              '& .MuiInputLabel-root': { color: 'white', fontWeight: 'bold', fontFamily: 'Poppins' },
              '& .MuiInputBase-root': { color: 'white', fontWeight: 'bold', fontFamily: 'Poppins' },
            }}
          />

      {/* Questions Section */}
      <Box className="questions-section">
        {quizDetails.questions.map((question, questionIndex) => (
          <Box key={questionIndex} className="question-container">
            <TextField
              label={`Question ${questionIndex + 1}`}
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              value={question.questionText}
              onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ff9100' },
                  '&:hover fieldset': { borderColor: '#ff5e00' },
                  '&.Mui-focused fieldset': { borderColor: '#ff5e00' },
                },
                '& .MuiInputLabel-root': { color: 'white', fontWeight: 'bold', fontFamily: 'Poppins' },
                '& .MuiInputBase-root': { color: 'white', fontWeight: 'bold', fontFamily: 'Poppins' },
              }}
            />
            <Box className="options-section">
              {question.options.map((option, optionIndex) => (
                <TextField
                  key={optionIndex}
                  label={`Option ${optionIndex + 1}`}
                  variant="outlined"
                  fullWidth
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(questionIndex, optionIndex, e.target.value)
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ff9100' },
                      '&:hover fieldset': { borderColor: '#ff5e00' },
                      '&.Mui-focused fieldset': { borderColor: '#ff5e00' },
                    },
                    '& .MuiInputLabel-root': { color: 'white', fontWeight: 'bold', fontFamily: 'Poppins' },
                    '& .MuiInputBase-root': { color: 'white', fontWeight: 'bold', fontFamily: 'Poppins' },
                  }}
                />
              ))}
            </Box>

            <Box className="correct-answer-section">
  <Typography variant="h6" className="correct-answer-label" sx={{ color: 'white', fontWeight: 'bold', fontFamily: 'Poppins',
    marginBottom: '10px', textAlign: 'center', // Space between the label and radio buttons
  }}>
    Correct Answer
  </Typography>
  <RadioGroup
    value={question.correctAnswer}
    onChange={(e) => handleCorrectAnswerChange(questionIndex, e.target.value)}
    row
    sx={{
      display: 'flex',
      justifyContent: 'space-evenly', // Space the options evenly
    }}
  >
    {question.options.map((option, index) => (
      <FormControlLabel
        key={index}
        value={index.toString()} // Correct answer should be stored as a string
        control={<Radio sx={{ color: 'white' }} />}
        label={<span style={{ color: 'white', fontWeight: 'bold' }}>{`Option ${index + 1}`}</span>}
        sx={{
          color: 'white',
          '& .MuiFormControlLabel-label': {
            fontWeight: 'bold', // Increase font weight for labels
          },
          marginRight: '10px', // Space between radio buttons
        }}
      />
    ))}
  </RadioGroup>
</Box>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleRemoveQuestion(questionIndex)}
              className="remove-question-btn"
              sx={{
                color: 'white',
                backgroundColor: '#ff5e00',
                '&:hover': { backgroundColor: '#ff9100' },
            alignSelf: 'center', // To center the button

              }}
            >
              Remove Question
            </Button>
          </Box>
        ))}
        
            <Button
          variant="outlined"
          onClick={handleAddQuestion}
          startIcon={<AddCircleOutlineIcon />}
          className="add-question-btn"
          sx={{
            color: 'white',
            backgroundColor: '#ff5e00',
            '&:hover': { backgroundColor: '#ff9100' },
            alignSelf: 'center', // To center the button
          }}
        >
          Add Question
        </Button>
          
      </Box>

      <Box
  sx={{
    display: 'flex',
    justifyContent: 'space-between', // To position buttons on left and right
    width: '100%',
    padding: '20px', // Optional padding for spacing
  }}
>
  {/* Back Button */}
  <Button
    variant="outlined"
    onClick={() => navigate('/instructor-dashboard')}
    startIcon={<NavigateBefore />}
    sx={{
        color: 'white',
        backgroundColor: '#ff5e00',
        '&:hover': { backgroundColor: '#ff9100' },
      }}
  >
    Back to Dashboard
  </Button>

  {/* Save Quiz Button */}
    <Button
    variant="contained"
    onClick={handleSaveQuiz}
    className="save-btn"
    sx={{
        color: 'white',
        backgroundColor: '#ff5e00',
        '&:hover': { backgroundColor: '#ff9100' },
      }}
  >
    Save Quiz
  </Button>
</Box>

    </Box>
  );
};

export default EditQuiz;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { NavigateBefore } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import './Styles/EditQuiz.css';
import axios from 'axios';
import Footer from './Footer';
import Header from './Header';
const ENDPOINT = process.env.BACKEND_URL || "http://localhost:8000";

const EditQuiz = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quizDetails, setQuizDetails] = useState({
    quizTitle: '', // Initially set to empty or null
    passingScore: '', // Initially set to empty or null
    questions: [],
  });

  const [loading, setLoading] = useState(true); // Loading state for API call
  const [error, setError] = useState(null); // Error state for handling errors
  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/instructor/quiz/details/${id}`);
        const { quizTitle, passingScore, questions } = response.data;
        console.log(response.data);
        setQuizDetails({ quizTitle, passingScore, questions });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch quiz details.');
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [id]);
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

  const handleSaveQuiz = async () => {
    if (!quizDetails.quizTitle || !quizDetails.passingScore || quizDetails.questions.length === 0) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      await axios.put(`http://localhost:8000/instructor/quiz/update/${id}`, quizDetails);
      alert('Quiz updated successfully!');
      navigate('/instructor-dashboard');
    } catch (err) {
      console.error('Failed to update quiz:', err);
      alert('Failed to update quiz. Please try again.');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <Header />
      <div className='Wrapper'>
        <Box className="create-quiz-container">
          <div className="title">Edit Quiz</div>

          {/* Quiz Title */}
          <TextField
            label="Quiz Title"
            variant="outlined"
            fullWidth
            type="String"
            value={quizDetails.quizTitle}
            onChange={(e) =>
              setQuizDetails((prev) => ({
                ...prev,
                quizTitle: e.target.value,
              }))
            }
            className="title"
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
                  <Typography variant="h6" className="correct-answer-label" sx={{
                    color: 'white', fontWeight: 'bold', fontFamily: 'Poppins',
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
                backgroundColor: '#ff9100',
                '&:hover': { backgroundColor: '#ff5e00' },
                marginTop: '25px',
                height: '55px'
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
      </div>
      <Footer />
    </>
  );
};

export default EditQuiz;
import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import './Styles/CreateQuiz.css';

const ENDPOINT = process.env.BACKEND_URL || "http://localhost:8000";

const CreateQuiz = () => {
  const navigate = useNavigate();

  const [quizDetails, setQuizDetails] = useState({
    quizTitle: '',
    passingScore: '',
    questions: [],
    courseName: '',
  });

  const handleAddQuestion = () => {
    const newQuestion = {
      questionText: '',
      options: ['', '', '', ''], // Four options
      correctAnswer: '', // Correct answer index
    };
    setQuizDetails((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
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
    updatedQuestions[questionIndex].correctAnswer = parseInt(value); // Convert to integer
    setQuizDetails((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleSubmitQuiz = async () => {

    if (!quizDetails.passingScore || quizDetails.questions.length === 0 || !quizDetails.courseName || !quizDetails.quizTitle) {
      alert('Please fill in all required fields.');
      return;
    }

    if (quizDetails.passingScore < 0 || quizDetails.passingScore > 100) {
      alert('Please enter a valid passing score.');
      return;
    }

    // const courseId = await getCourseIdByName(quizDetails.courseName);
    // if (!courseId) {
    //   return; // Stop if courseId is not found
    // }

    const quizData = {
      quizTitle: quizDetails.quizTitle,
      courseName: quizDetails.courseName,
      passingScore: quizDetails.passingScore,

      questions: quizDetails.questions,
    };
    try {
      const response = await fetch(`${ENDPOINT}/instructor/quiz/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Quiz created successfully!');
        navigate('/instructor-dashboard'); // Redirect after successful creation
      } else {
        console.error('Failed to create quiz:', data.message);
        alert('Failed to create quiz');
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('An error occurred while creating the quiz.');
    }
  };

  return (
    <Box className="quiz_creation-container">
      <div className='quiz_creation-title'>
        Create Quiz
      </div>

      <TextField
        label="Course Name"
        variant="outlined"
        fullWidth
        type="text" // Changed type to text
        value={quizDetails.courseName} // Assuming "courseName" is a property in quizDetails
        onChange={(e) =>
          setQuizDetails((prev) => ({
            ...prev,
            courseName: e.target.value, // Update courseName property
          }))
        }
        className="quiz_creation-course-name-input"
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ff9100', // Orange border
            },
            '&:hover fieldset': {
              borderColor: '#ff5e00', // Hover color
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ff5e00', // Focused border color
            },
          },
          '& .MuiInputLabel-root': {
            color: 'white', // White label text
            fontWeight: 'bold',
            fontFamily: 'Poppins', // Set font family to Poppins
          },
          '& .MuiInputBase-root': {
            color: 'white', // White input text color
            fontWeight: 'bold',
            fontFamily: 'Poppins', // Set font family to Poppins
          },
        }}
      />

      <div> </div>
      <TextField
        label="Quiz Title"
        variant="outlined"
        fullWidth
        type="text" // Changed type to text
        value={quizDetails.quizTitle} // Assuming "courseName" is a property in quizDetails
        onChange={(e) =>
          setQuizDetails((prev) => ({
            ...prev,
            quizTitle: e.target.value, // Update courseName property
          }))
        }
        className="quiz_creation-quiz-title-input"
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ff9100', // Orange border
            },
            '&:hover fieldset': {
              borderColor: '#ff5e00', // Hover color
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ff5e00', // Focused border color
            },
          },
          '& .MuiInputLabel-root': {
            color: 'white', // White label text
            fontWeight: 'bold',
            fontFamily: 'Poppins', // Set font family to Poppins
          },
          '& .MuiInputBase-root': {
            color: 'white', // White input text color
            fontWeight: 'bold',
            fontFamily: 'Poppins', // Set font family to Poppins
          },
        }}
      />

      <div> </div>

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
        className="quiz_creation-passing-score-input"
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ff9100', // Orange border
            },
            '&:hover fieldset': {
              borderColor: '#ff5e00', // Hover color
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ff5e00', // Focused border color
            },
          },
          '& .MuiInputLabel-root': {
            color: 'white', // White label text
            fontWeight: 'bold',
            fontFamily: 'Poppins', // Set font family to Poppins
          },
          '& .MuiInputBase-root': {
            color: 'white', // White input text color
            fontWeight: 'bold',
            fontFamily: 'Poppins', // Set font family to Poppins
          },
        }}
      />

      <Box className="quiz_creation-questions-section">
        {quizDetails.questions.map((question, questionIndex) => (
          <Box key={questionIndex} className="quiz_creation-question-container">
            <TextField
              label={`Question ${questionIndex + 1}`}
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              value={question.questionText}
              onChange={(e) =>
                handleQuestionChange(questionIndex, e.target.value)
              }
              className="quiz_creation-question-input"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#ff9100', // Orange border
                  },
                  '&:hover fieldset': {
                    borderColor: '#ff5e00', // Hover color
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff5e00', // Focused border color
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'white', // White label text
                  fontWeight: 'bold',
                  fontFamily: 'Poppins', // Set font family to Poppins
                },
                '& .MuiInputBase-root': {
                  color: 'white', // White input text color
                  fontWeight: 'bold',
                  fontFamily: 'Poppins', // Set font family to Poppins
                },
              }}
            />
            <Box className="quiz_creation-options-section">
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
                  className="quiz_creation-option-input"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#ff9100', // Orange border
                      },
                      '&:hover fieldset': {
                        borderColor: '#ff5e00', // Hover color
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ff5e00', // Focused border color
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'white', // White label text
                      fontWeight: 'bold',
                      fontFamily: 'Poppins', // Set font family to Poppins
                    },
                    '& .MuiInputBase-root': {
                      color: 'white', // White input text color
                      fontWeight: 'bold',
                      fontFamily: 'Poppins', // Set font family to Poppins
                    },
                  }}
                />
              ))}
            </Box>
            <Box className="quiz_creation-correct-answer-section">
              <Typography variant="h6" className="quiz_creation-correct-answer-label" sx={{ color: 'white', fontWeight: 'bold', fontFamily: 'Poppins', textAlign: 'center', marginBottom: '5px', marginTop: '5px', }}>
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
          </Box>
        ))}
        <Box className="quiz_creation-add-question-button">
          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddQuestion}
            sx={{
              color: 'white',
              fontFamily: 'Poppins, sans-serif', // Set font family to Poppins
              fontWeight: 500, // Set font weight to 500
              backgroundColor: '#ff9100',// Set background color
              '&:hover': {
                backgroundColor: '#ff5e00', // Hover background color
              },
            }}
          >
            Add Question
          </Button>
        </Box>
      </Box>

      <Box className="quiz_creation-buttons-container">
        <Button
          variant="outlined"
          startIcon={<NavigateBefore />}
          onClick={() => navigate('/instructor-dashboard')}
          className="quiz_creation-cancel-button"
          sx={{
            color: 'white',
            fontFamily: 'Poppins, sans-serif', // Set font family to Poppins
            fontWeight: 500, // Set font weight to 500
            backgroundColor: '#ff9100',
            '&:hover': {
              backgroundColor: '#ff5e00', // Hover background color
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmitQuiz}
          className="quiz_creation-submit-button"
          sx={{
            color: 'white',
            fontFamily: 'Poppins, sans-serif', // Set font family to Poppins
            fontWeight: 500, // Set font weight to 500
            backgroundColor: '#ff9100',
            '&:hover': {
              backgroundColor: '#ff5e00', // Hover background color
            },
          }}
        >
          Save Quiz
        </Button>
      </Box>
    </Box>
  );
};

export default CreateQuiz;

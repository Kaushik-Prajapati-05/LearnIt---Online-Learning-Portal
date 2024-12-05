const express = require('express');
const router = express.Router();
const { addQuiz , getAllquizzes} = require('../../controllers/Instructor/quiz-controller'); // Import the addQuiz controller function

// Route to add a quiz
router.post('/add', addQuiz);
router.get('/getAllquizzes/:instructorId', getAllquizzes);

module.exports = router;

const express = require('express');
const router = express.Router();
const { addQuiz , getAllquizzes,getQuizById, updateQuizById} = require('../../controllers/Instructor/quiz-controller'); // Import the addQuiz controller function

// Route to add a quiz
router.post('/add', addQuiz);
router.get('/getAllquizzes/:instructorId', getAllquizzes);
router.get('/details/:id',getQuizById);
router.put('/update/:id',updateQuizById);

module.exports = router;

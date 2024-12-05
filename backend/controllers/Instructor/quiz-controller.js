const Quiz = require('../../models/Quiz');
const Course = require('../../models/Course');

// Controller function to add a quiz
const addQuiz = async (req, res) => {
  const { courseName, quizTitle, passingScore, questions } = req.body;

  // Validate input
  if (!quizTitle || !courseName || !passingScore || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  try {
    // Find the course by its title
    const course = await Course.findOne({ title: courseName });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create and save the quiz with the associated courseId
    const newQuiz = new Quiz({
      courseId: course._id, // Associate the courseId
      quizTitle,
      passingScore,
      questions,
    });

    await newQuiz.save();

    res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
  } catch (error) {
    console.error('Error saving quiz:', error);
    res.status(500).json({ message: 'Failed to create quiz' });
  }
};
const getQuizById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the quiz by ID
    const quiz = await Quiz.findById(id);
    
    // If quiz is not found, return a 404 error
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Return the quiz data (passing score and questions)
    res.json({
      quizTitle: quiz.quizTitle,
      passingScore: quiz.passingScore,
      questions: quiz.questions,
    });
  } catch (error) {
    // Handle any other errors
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getAllquizzes = async (req, res) => {
  const { instructorId } = req.params; // instructorId from the route parameters

  try {
    // Step 1: Fetch the courses taught by the instructor
    const courses = await Course.find({ instructorId: instructorId });
    
    if (!courses.length) {
      return res.status(404).json({ message: 'No courses found for this instructor.' });
    }

    // Step 2: Extract courseIds from the fetched courses
    const courseIds = courses.map(course => course._id);

    // Step 3: Fetch quizzes related to the found courses
    const quizzes = await Quiz.find({ courseId: { $in: courseIds } })
      .populate('courseId', 'title'); // Populate course title for each quiz
    
    if (!quizzes.length) {
      return res.status(404).json({ message: 'No quizzes found for this instructor.' });
    }

    // Return the quizzes found
    res.status(200).json({ data: quizzes });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'An error occurred while fetching quizzes.' });
  }
};

const updateQuizById = async (req, res) => {
  const {id} = req.params; // Extract quiz ID from the route parameters
  const { quizTitle,passingScore, questions } = req.body; // Extract data from the request body

  try {
    // Validate input data
    if (!quizTitle||!passingScore || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Invalid input data. Passing score and questions are required.' });
    }

    // Find the quiz by ID and update it
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { quizTitle,passingScore, questions },
      { new: true, runValidators: true } // Return the updated document and validate inputs
    );

    // If quiz not found
    if (!updatedQuiz) {
      return res.status(404).json({ error: 'Quiz not found.' });
    }

    // Respond with the updated quiz
    res.status(200).json({
      message: 'Quiz updated successfully.',
      quiz: updatedQuiz,
    });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ error: 'An error occurred while updating the quiz.' });
  }
};


module.exports = {
  addQuiz,
  getAllquizzes,
  getQuizById,
  updateQuizById,
};

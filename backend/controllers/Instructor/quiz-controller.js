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


module.exports = {
  addQuiz,
  getAllquizzes,
};

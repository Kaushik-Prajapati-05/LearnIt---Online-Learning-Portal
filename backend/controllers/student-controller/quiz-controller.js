const mongoose = require("mongoose");
const Quiz = require("../../models/Quiz");
const Course = require("../../models/Course");

const getQuizzesByCourseId = async (req, res) => {
  const { id: courseId } = req.params; // Rename for clarity
  console.log("Course ID:", courseId);

  try {
    // Validate courseId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    // Check if the course exists
    const course = await Course.findById(courseId);
    console.log("Course Found:", course);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Fetch quizzes associated with the courseId
    const quizzes = await Quiz.find({ courseId }).select("-questions.correctAnswer");
    console.log("Quizzes Found:", quizzes);

    // Return quizzes or a friendly message if none are found
    if (quizzes.length === 0) {
      return res.status(404).json({ message: "No quizzes available for this course" });
    }

    res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching quizzes",
    });
  }
};

module.exports = { getQuizzesByCourseId };

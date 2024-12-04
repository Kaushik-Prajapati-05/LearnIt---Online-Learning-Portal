const Course = require('../../models/Course'); // Ensure the path is correct
const User = require('../../models/User'); // Ensure the path is correct
const StudentCourses = require('../../models/StudentCourses'); // Ensure the path is correct


// List Courses Controller
const listCourses = async (req, res) => {
  console.log("Reached listCourses");


  try {
    const { studentId } = req.body; // Assuming studentId is passed as a query parameter


    // Validate input
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: studentId',
      });
}


    // Find the student's courses
    const studentCourses = await StudentCourses.findOne({ userId: studentId });


    if (!studentCourses || studentCourses.courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No courses found for this student',
      });
    }


    console.log(studentCourses);  
    res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully',
      data: studentCourses.courses,
    });
  } catch (error) {
    console.error('Error in listCourses:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving courses',
    });
  }
};


// Export the controller
module.exports = {
  listCourses,
};

const Course = require('../../models/Course'); // Ensure the path is correct
const User = require('../../models/User'); // Ensure the path is correct
const StudentCourses = require('../../models/StudentCourses'); // Ensure the path is correct

// Buy Now Controller
const buyNow = async (req, res) => {
  console.log("Reached Buy-now");
  try {
    const { courseId, studentId, paidAmount } = req.body;

    console.log(req.body);
    // Validate input
    if (!courseId || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: courseId, studentId, or paidAmount',
      }); 
    }

    // Find course and student
    const course = await Course.findById(courseId);
    const student = await User.findById(studentId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Check if student already purchased the course
    const alreadyPurchased = course.students.some(
      (enrolled) => enrolled.studentId === studentId
    );

    if (alreadyPurchased) {
      return res.status(400).json({
        success: false,
        message: 'Student already enrolled in this course',
      });
    }

    // Add student to the course
    const studentData = {
      studentId,
      studentName: student.userName,
      studentEmail: student.userEmail,
      paidAmount,
    };

    course.students.push(studentData);

    // Save the updated course
    await course.save();

    // Update or create entry in StudentCourses
    const courseDetails = {
      courseId,
      title: course.title,
      instructorId: course.instructorId,
      instructorName: course.instructorName,
      dateOfPurchase: new Date(),
      courseImage: course.image || '', // Assuming courseImage exists in Course model
    };

    console.log(course);

    const studentCourses = await StudentCourses.findOne({ userId: studentId });

    if (studentCourses) {
      // If student record exists, update the courses array
      studentCourses.courses.push(courseDetails);
      await studentCourses.save();
    } else {
      // If student record does not exist, create a new one
      const newStudentCourses = new StudentCourses({
        userId: studentId,
        courses: [courseDetails],
      });
      await newStudentCourses.save();
    }

    res.status(200).json({
      success: true,
      message: 'Course purchased successfully',
      data: course,
    });
  } catch (error) {
    console.error('Error in buyNow:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing purchase',
    });
  }
};

// Export the controller
module.exports = {
  buyNow,
};

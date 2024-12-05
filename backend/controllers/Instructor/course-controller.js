const Course = require("../../models/Course");
const User = require("../../models/User");

const addNewCourse = async (req, res) => {
  console.log("addNewCourse")
  try {
    var courseData = req.body;  
    if(!courseData.pricing )courseData.pricing='0';

    console.log(courseData);
   // Check if a course with the same title already exists
    const existingCourse = await Course.findOne({ title: courseData.title });

    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: "A course with this title already exists. Please choose a different title.",
      });
    }

    // Create and save the new course 
    const newlyCreatedCourse = new Course(courseData);
    const saveCourse = await newlyCreatedCourse.save();

    res.status(201).json({
      success: true,
      message: "Course saved successfully",
      data: saveCourse, 
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};


const getCourseById = async (req, res) => {
  try {
    const { instructorId } = req.params; 
    console.log(instructorId);

    // Validate the instructorId
    if (!instructorId) {
      return res.status(400).json({
        success: false,
        message: "Instructor ID is required!",
      });
    }

    // Check if the user with the given instructorId exists and has the role 'instructor'
    const instructor = await User.findOne({ _id: instructorId, role: "Instructor" });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found or does not have the role 'instructor'!",
      });
    }

    // Fetch all courses associated with this instructor
    const courses = await Course.find({ instructorId });
console.log(courses);
    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving courses!",
    });
  }
};


const getAllCourses = async (req, res) => {
  try {
    const coursesList = await Course.find({});

    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getCourseDetailsByID = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateCourseByID = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourseData = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updatedCourseData,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  addNewCourse,
  getAllCourses,
  updateCourseByID,
  getCourseDetailsByID,
  getCourseById
};

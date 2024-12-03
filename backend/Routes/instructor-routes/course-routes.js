const express = require("express");
const {
  addNewCourse,
  getAllCourses,
  getCourseDetailsByID,
  updateCourseByID,
  getCourseById
} = require("../../controllers/Instructor/course-controller");
const router = express.Router();

router.post("/add", addNewCourse);
router.get("/get", getAllCourses);
router.get("/getbyid/:instructorId",getCourseById);
router.get("/get/details/:id", getCourseDetailsByID);
router.put("/update/:id", updateCourseByID);

module.exports = router;

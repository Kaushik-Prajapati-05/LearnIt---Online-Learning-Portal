const express = require("express");
const getCourseDetails = require("../../controllers/student-controller/course-controller");
const {buyNow} = require("../../controllers/student-controller/buynow-controller");
const {listCourses} = require("../../controllers/student-controller/list-courses");
const router = express.Router();

router.route('/:id').get(getCourseDetails.getStudentViewCourseDetails);
router.route('/buy').post(buyNow);
router.route('/listcourses').post(listCourses);


module.exports = router;

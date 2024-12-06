const express = require("express");
const getCourseDetails = require("../../controllers/student-controller/course-controller");
const {buyNow} = require("../../controllers/student-controller/buynow-controller");
const {listCourses} = require("../../controllers/student-controller/List-course");
const {getQuizzesByCourseId} = require("../../controllers/student-controller/quiz-controller");
const router = express.Router();

router.route('/:id').get(getCourseDetails.getStudentViewCourseDetails);
router.route('/buy').post(buyNow);
router.route('/listcourses').post(listCourses);
router.route('/quiz/:id').get(getQuizzesByCourseId);


module.exports = router;

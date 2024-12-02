
// Unit tests for: buyNow




const { buyNow } = require('../buynow-controller');
const Course = require('../../../models/Course');
const User = require('../../../models/User');
const StudentCourses = require('../../../models/StudentCourses');
//const { buyNow } = require('../../../controllers/student-controller/buynow-controller');
jest.mock("../../../models/Course");
jest.mock("../../../models/User");
jest.mock("../../../models/StudentCourses");

describe('buyNow() buyNow method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        courseId: 'course123',
        studentId: 'student123',
        paidAmount: 100,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('Happy Paths', () => {
    it('should successfully purchase a course', async () => {
      // Mocking Course and User models
      const mockCourse = {
        students: [],
        save: jest.fn(),
        title: 'Test Course',
        instructorId: 'instructor123',
        instructorName: 'Instructor Name',
        courseImage: 'image.jpg',
      };
      const mockStudent = {
        userName: 'Student Name',
        userEmail: 'student@example.com',
      };
      const mockStudentCourses = {
        courses: [],
        save: jest.fn(),
      };

      Course.findById.mockResolvedValue(mockCourse);
      User.findById.mockResolvedValue(mockStudent);
      StudentCourses.findOne.mockResolvedValue(mockStudentCourses);

      await buyNow(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Course purchased successfully',
        data: mockCourse,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return 400 if courseId or studentId is missing', async () => {
      req.body.courseId = null;

      await buyNow(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Missing required fields: courseId, studentId, or paidAmount',
      });
    });

    it('should return 404 if course is not found', async () => {
      Course.findById.mockResolvedValue(null);

      await buyNow(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Course not found',
      });
    });

    it('should return 404 if student is not found', async () => {
      const mockCourse = { students: [] };
      Course.findById.mockResolvedValue(mockCourse);
      User.findById.mockResolvedValue(null);

      await buyNow(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Student not found',
      });
    });

    it('should return 400 if student already enrolled in the course', async () => {
      const mockCourse = {
        students: [{ studentId: 'student123' }],
      };
      const mockStudent = {
        userName: 'Student Name',
        userEmail: 'student@example.com',
      };

      Course.findById.mockResolvedValue(mockCourse);
      User.findById.mockResolvedValue(mockStudent);

      await buyNow(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Student already enrolled in this course',
      });
    });

    it('should return 500 on server error', async () => {
      Course.findById.mockRejectedValue(new Error('Database error'));

      await buyNow(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Server error while processing purchase',
      });
    });
  });
});

// End of unit tests for: buyNow

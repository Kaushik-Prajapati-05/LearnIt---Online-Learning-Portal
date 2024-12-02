
// Unit tests for: listCourses




const { listCourses } = require('../List-course');
const StudentCourses = require('../../../models/StudentCourses');
//const { listCourses } = require('../../../controllers/student-controller/List-course');
jest.mock("../../../models/StudentCourses");

describe('listCourses() listCourses method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should return courses successfully when studentId is valid and courses exist', async () => {
      // Arrange
      req.body.studentId = 'validStudentId';
      const mockCourses = [{ id: 'course1' }, { id: 'course2' }];
      StudentCourses.findOne.mockResolvedValue({ courses: mockCourses });

      // Act
      await listCourses(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Courses retrieved successfully',
        data: mockCourses
      });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return 400 error when studentId is missing', async () => {
      // Arrange
      req.body.studentId = undefined;

      // Act
      await listCourses(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Missing required field: studentId'
      });
    });

    it('should return 404 error when no courses are found for the student', async () => {
      // Arrange
      req.body.studentId = 'validStudentId';
      StudentCourses.findOne.mockResolvedValue({ courses: [] });

      // Act
      await listCourses(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'No courses found for this student'
      });
    });

    it('should return 404 error when studentCourses is null', async () => {
      // Arrange
      req.body.studentId = 'validStudentId';
      StudentCourses.findOne.mockResolvedValue(null);

      // Act
      await listCourses(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'No courses found for this student'
      });
    });

    it('should return 500 error when there is a server error', async () => {
      // Arrange
      req.body.studentId = 'validStudentId';
      StudentCourses.findOne.mockRejectedValue(new Error('Database error'));

      // Act
      await listCourses(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Server error while retrieving courses'
      });
    });
  });
});

// End of unit tests for: listCourses

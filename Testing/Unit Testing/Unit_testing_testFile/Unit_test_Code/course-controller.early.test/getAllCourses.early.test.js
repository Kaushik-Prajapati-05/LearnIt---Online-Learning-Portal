
// Unit tests for: getAllCourses




const { getAllCourses } = require('../course-controller');
const Course = require("../../models/Course");
//const { getAllCourses } = require('../../controllers/course-controller');
jest.mock("../../models/Course");

describe('getAllCourses() getAllCourses method', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('Happy Paths', () => {
    it('should return a list of courses with status 200 when courses are found', async () => {
      // Arrange: Mock the Course.find method to return a list of courses
      const mockCourses = [
        { id: 1, name: 'Course 1' },
        { id: 2, name: 'Course 2' },
      ];
      Course.find.mockResolvedValue(mockCourses);

      // Act: Call the getAllCourses function
      await getAllCourses(req, res);

      // Assert: Check that the response is as expected
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCourses,
      });
    });

    it('should return an empty list with status 200 when no courses are found', async () => {
      // Arrange: Mock the Course.find method to return an empty list
      Course.find.mockResolvedValue([]);

      // Act: Call the getAllCourses function
      await getAllCourses(req, res);

      // Assert: Check that the response is as expected
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [],
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return status 500 when an error occurs during fetching courses', async () => {
      // Arrange: Mock the Course.find method to throw an error
      Course.find.mockRejectedValue(new Error('Database error'));

      // Act: Call the getAllCourses function
      await getAllCourses(req, res);

      // Assert: Check that the response is as expected
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Some error occured!',
      });
    });
  });
});

// End of unit tests for: getAllCourses

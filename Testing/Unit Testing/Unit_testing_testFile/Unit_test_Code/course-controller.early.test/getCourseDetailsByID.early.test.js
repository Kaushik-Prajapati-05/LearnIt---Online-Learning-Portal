
// Unit tests for: getCourseDetailsByID




const { getCourseDetailsByID } = require('../course-controller');
const Course = require("../../models/Course");
//const { getCourseDetailsByID } = require('../../controllers/course-controller');
jest.mock("../../models/Course");

describe('getCourseDetailsByID() getCourseDetailsByID method', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: '123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('Happy paths', () => {
    it('should return course details when a valid ID is provided', async () => {
      // Arrange: Mock Course.findById to return a valid course object
      const mockCourse = { id: '123', name: 'Test Course' };
      Course.findById.mockResolvedValue(mockCourse);

      // Act: Call the function
      await getCourseDetailsByID(req, res);

      // Assert: Check if the response is correct
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCourse,
      });
    });
  });

  describe('Edge cases', () => {
    it('should return 404 when course is not found', async () => {
      // Arrange: Mock Course.findById to return null
      Course.findById.mockResolvedValue(null);

      // Act: Call the function
      await getCourseDetailsByID(req, res);

      // Assert: Check if the response is 404
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Course not found!',
      });
    });

    it('should return 500 when an error occurs', async () => {
      // Arrange: Mock Course.findById to throw an error
      Course.findById.mockRejectedValue(new Error('Database error'));

      // Act: Call the function
      await getCourseDetailsByID(req, res);

      // Assert: Check if the response is 500
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Some error occured!',
      });
    });

    it('should handle invalid ID format gracefully', async () => {
      // Arrange: Set an invalid ID format
      req.params.id = 'invalid-id-format';
      Course.findById.mockResolvedValue(null);

      // Act: Call the function
      await getCourseDetailsByID(req, res);

      // Assert: Check if the response is 404
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Course not found!',
      });
    });
  });
});

// End of unit tests for: getCourseDetailsByID

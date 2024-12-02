
// Unit tests for: getStudentViewCourseDetails




const { getStudentViewCourseDetails } = require('../course-controller');
const Course = require("../../../models/Course");
//const { getStudentViewCourseDetails } = require('../../../controllers/student-controller/course-controller');
jest.mock("../../../models/Course");

describe('getStudentViewCourseDetails() getStudentViewCourseDetails method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: 'validCourseId',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should return course details when a valid course ID is provided', async () => {
      // Arrange: Mock Course.findById to return a valid course object
      const mockCourseDetails = { id: 'validCourseId', name: 'Test Course' };
      Course.findById.mockResolvedValue(mockCourseDetails);

      // Act: Call the function
      await getStudentViewCourseDetails(req, res);

      // Assert: Check if the response is correct
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCourseDetails,
      });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return 404 when the course is not found', async () => {
      // Arrange: Mock Course.findById to return null
      Course.findById.mockResolvedValue(null);

      // Act: Call the function
      await getStudentViewCourseDetails(req, res);

      // Assert: Check if the response is 404
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Course not found!',
      });
    });

    it('should return 500 when there is an error fetching course details', async () => {
      // Arrange: Mock Course.findById to throw an error
      Course.findById.mockRejectedValue(new Error('Database error'));

      // Act: Call the function
      await getStudentViewCourseDetails(req, res);

      // Assert: Check if the response is 500
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Some error occurred!',
      });
    });

    it('should handle invalid course ID format gracefully', async () => {
      // Arrange: Set an invalid course ID
      req.params.id = 'invalidCourseId';

      // Mock Course.findById to return null for invalid ID
      Course.findById.mockResolvedValue(null);

      // Act: Call the function
      await getStudentViewCourseDetails(req, res);

      // Assert: Check if the response is 404
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Course not found!',
      });
    });
  });
});

// End of unit tests for: getStudentViewCourseDetails

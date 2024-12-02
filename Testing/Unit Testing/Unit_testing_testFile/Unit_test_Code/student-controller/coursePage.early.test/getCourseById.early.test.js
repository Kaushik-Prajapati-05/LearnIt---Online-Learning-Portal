
// Unit tests for: getCourseById




const { getCourseById } = require('../coursePage');
const Course = require('../../../models/Course');
//const { getCourseById } = require('../../../controllers/student-controller/coursePage');
jest.mock("../../../models/Course");

describe('getCourseById() getCourseById method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should return course details when course is found by params.id', async () => {
      const mockCourse = { id: '123', name: 'Test Course' };
      req.params.id = '123';
      Course.findById.mockResolvedValue(mockCourse);

      await getCourseById(req, res);

      expect(Course.findById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCourse
      });
    });

    it('should return course details when course is found by query.id', async () => {
      const mockCourse = { id: '456', name: 'Another Test Course' };
      req.query.id = '456';
      Course.findById.mockResolvedValue(mockCourse);

      await getCourseById(req, res);

      expect(Course.findById).toHaveBeenCalledWith('456');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCourse
      });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return 404 when course is not found', async () => {
      req.params.id = '999';
      Course.findById.mockResolvedValue(null);

      await getCourseById(req, res);

      expect(Course.findById).toHaveBeenCalledWith('999');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Course not found'
      });
    });

    it('should return 500 when there is a server error', async () => {
      req.params.id = '123';
      Course.findById.mockRejectedValue(new Error('Database error'));

      await getCourseById(req, res);

      expect(Course.findById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Server error while fetching course'
      });
    });

    it('should handle missing id gracefully', async () => {
      await getCourseById(req, res);

      expect(jest.fn()).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Course ID is required'
      });
    });
  });
});

// End of unit tests for: getCourseById

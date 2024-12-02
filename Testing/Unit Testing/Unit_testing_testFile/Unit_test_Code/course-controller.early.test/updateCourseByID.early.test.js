
// Unit tests for: updateCourseByID




const { updateCourseByID } = require('../course-controller');
const Course = require("../../models/Course");
//const { updateCourseByID } = require('../../controllers/course-controller');
jest.mock("../../models/Course");

describe('updateCourseByID() updateCourseByID method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 'courseId123' },
      body: { title: 'Updated Course Title', description: 'Updated Description' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('Happy Paths', () => {
    it('should update the course successfully and return 200 status', async () => {
      // Arrange
      const updatedCourse = { _id: 'courseId123', ...req.body };
      Course.findByIdAndUpdate.mockResolvedValue(updatedCourse);

      // Act
      await updateCourseByID(req, res);

      // Assert
      expect(Course.findByIdAndUpdate).toHaveBeenCalledWith('courseId123', req.body, { new: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Course updated successfully',
        data: updatedCourse
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return 404 if the course is not found', async () => {
      // Arrange
      Course.findByIdAndUpdate.mockResolvedValue(null);

      // Act
      await updateCourseByID(req, res);

      // Assert
      expect(Course.findByIdAndUpdate).toHaveBeenCalledWith('courseId123', req.body, { new: true });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Course not found!'
      });
    });

    it('should return 500 if there is a server error', async () => {
      // Arrange
      const error = new Error('Database error');
      Course.findByIdAndUpdate.mockRejectedValue(error);

      // Act
      await updateCourseByID(req, res);

      // Assert
      expect(Course.findByIdAndUpdate).toHaveBeenCalledWith('courseId123', req.body, { new: true });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Some error occured!'
      });
    });
  });
});

// End of unit tests for: updateCourseByID

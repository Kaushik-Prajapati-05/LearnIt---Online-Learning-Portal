
// Unit tests for: addNewCourse




const { addNewCourse } = require('../course-controller');
const Course = require("../../models/Course");
//const { addNewCourse } = require('../../controllers/course-controller');
// Import necessary modules
// Mock the Course model
jest.mock("../../models/Course");

describe('addNewCourse() addNewCourse method', () => {
  let req, res;

  beforeEach(() => {
    // Set up mock request and response objects
    req = {
      body: {
        title: 'New Course',
        description: 'Course Description',
        // Add other necessary fields
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('Happy paths', () => {
    it('should save a new course and return a success response', async () => {
      // Mock the save method to resolve successfully
      Course.prototype.save = jest.fn().mockResolvedValue(req.body);

      await addNewCourse(req, res);

      // Verify that the response status is 201 and the correct JSON is returned
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Course saved successfully',
        data: req.body,
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle errors during course saving and return a 500 response', async () => {
      // Mock the save method to throw an error
      Course.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      await addNewCourse(req, res);

      // Verify that the response status is 500 and the correct JSON is returned
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Some error occured!',
      });
    });

    it('should handle missing course data gracefully', async () => {
      // Set req.body to an empty object to simulate missing data
      req.body = {};

      // Mock the save method to resolve successfully
      Course.prototype.save = jest.fn().mockResolvedValue(req.body);

      await addNewCourse(req, res);

      // Verify that the response status is 201 and the correct JSON is returned
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Course saved successfully',
        data: req.body,
      });
    });
  });
});

// End of unit tests for: addNewCourse

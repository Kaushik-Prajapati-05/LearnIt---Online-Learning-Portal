
// Unit tests for: registerUser




const { registerUser } = require('../registerUser');
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
// Import necessary modules and dependencies
// Mock the User model and bcrypt module
jest.mock("../../models/User");
jest.mock("bcryptjs");

describe('registerUser() registerUser method', () => {
  let req, res, jsonMock, statusMock;

  beforeEach(() => {
    // Set up mock request and response objects
    req = {
      body: {
        userName: 'testUser',
        userEmail: 'test@example.com',
        password: 'password123',
        role: 'user',
      },
    };

    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    res = {
      status: statusMock,
    };
  });

  describe('Happy Paths', () => {
    it('should register a new user successfully', async () => {
      // Mock User.findOne to return null (user does not exist)
      User.findOne.mockResolvedValue(null);

      // Mock bcrypt.hash to return a hashed password
      bcrypt.hash.mockResolvedValue('hashedPassword123');

      // Mock User.save to simulate successful save
      User.prototype.save = jest.fn().mockResolvedValue();

      await registerUser(req, res);

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ userEmail: 'test@example.com' }, { userName: 'testUser' }],
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(User.prototype.save).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully!',
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return an error if the email is already registered', async () => {
      // Mock User.findOne to return an existing user with the same email
      User.findOne.mockResolvedValue({ userEmail: 'test@example.com' });

      await registerUser(req, res);

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ userEmail: 'test@example.com' }, { userName: 'testUser' }],
      });
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Email is already registered',
      });
    });

    it('should return an error if the username is already taken', async () => {
      // Mock User.findOne to return an existing user with the same username
      User.findOne.mockResolvedValue({ userName: 'testUser' });

      await registerUser(req, res);

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ userEmail: 'test@example.com' }, { userName: 'testUser' }],
      });
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Username is already taken',
      });
    });

    it('should handle errors during user registration', async () => {
      // Mock User.findOne to throw an error
      User.findOne.mockRejectedValue(new Error('Database error'));

      await registerUser(req, res);

      // Assertions
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Some error occurred!',
      });
    });
  });
});

// End of unit tests for: registerUser

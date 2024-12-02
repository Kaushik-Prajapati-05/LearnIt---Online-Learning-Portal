
// Unit tests for: loginUser




const { loginUser } = require('../loginUser');
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Import necessary modules and dependencies
// Mock the dependencies
jest.mock("../../models/User");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe('loginUser() loginUser method', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        userEmail: 'test@example.com',
        password: 'password123',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('Happy Paths', () => {
    it('should log in a user with valid credentials', async () => {
      // Arrange
      const mockUser = {
        _id: 'userId123',
        userName: 'testUser',
        userEmail: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
      };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken');

      // Act
      await loginUser(req, res, next);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ userEmail: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          _id: 'userId123',
          userName: 'testUser',
          userEmail: 'test@example.com',
          role: 'user',
        },
        process.env.JWT_SECRET,
        { expiresIn: '120m' }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logged in successfully',
        data: {
          accessToken: 'mockToken',
          user: {
            _id: 'userId123',
            userName: 'testUser',
            userEmail: 'test@example.com',
            role: 'user',
          },
        },
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return 401 if user is not found', async () => {
      // Arrange
      User.findOne.mockResolvedValue(null);

      // Act
      await loginUser(req, res, next);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ userEmail: 'test@example.com' });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials',
      });
    });

    it('should return 401 if password is incorrect', async () => {
      // Arrange
      const mockUser = {
        _id: 'userId123',
        userName: 'testUser',
        userEmail: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
      };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      // Act
      await loginUser(req, res, next);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials',
      });
    });

    it('should return 500 if an error occurs during login', async () => {
      // Arrange
      User.findOne.mockRejectedValue(new Error('Database error'));

      // Act
      await loginUser(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Some error occurred!',
      });
    });
  });
});

// End of unit tests for: loginUser

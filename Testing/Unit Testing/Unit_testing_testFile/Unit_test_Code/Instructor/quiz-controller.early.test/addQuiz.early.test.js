
// Unit tests for: addQuiz




const { addQuiz } = require('../quiz-controller');
const Quiz = require('../../../models/Quiz');
//const { addQuiz } = require('../../../controllers/Instructor/quiz-controller');
jest.mock("../../../models/Quiz");

describe('addQuiz() addQuiz method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        passingScore: 70,
        questions: [{ question: 'What is 2+2?', answer: '4' }]
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should create a quiz successfully with valid input', async () => {
      // Arrange
      Quiz.prototype.save = jest.fn().mockResolvedValue();

      // Act
      await addQuiz(req, res);

      // Assert
      expect(Quiz).toHaveBeenCalledWith(req.body);
      expect(Quiz.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Quiz created successfully',
        quiz: expect.any(Object)
      });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return 400 if passingScore is missing', async () => {
      // Arrange
      req.body.passingScore = undefined;

      // Act
      await addQuiz(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid data' });
    });

    it('should return 400 if questions are missing', async () => {
      // Arrange
      req.body.questions = undefined;

      // Act
      await addQuiz(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid data' });
    });

    it('should return 400 if questions is not an array', async () => {
      // Arrange
      req.body.questions = 'Not an array';

      // Act
      await addQuiz(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid data' });
    });

    it('should return 500 if there is an error saving the quiz', async () => {
      // Arrange
      Quiz.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      // Act
      await addQuiz(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to create quiz' });
    });
  });
});

// End of unit tests for: addQuiz

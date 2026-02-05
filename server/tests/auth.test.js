const authController = require('../controllers/authController');
const User = require('../models/User');
const httpMocks = require('node-mocks-http');

jest.mock('../models/User');

describe('Auth Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should return 400 if user already exists', async () => {
            // Mock User.findOne to return a user (exists)
            User.findOne.mockResolvedValue({ email: 'test@test.com' });

            const req = httpMocks.createRequest({
                method: 'POST',
                url: '/api/auth/register',
                body: {
                    username: 'test',
                    email: 'test@test.com',
                    password: 'password'
                }
            });
            const res = httpMocks.createResponse();

            await authController.register(req, res);

            expect(res.statusCode).toBe(400);
            const data = res._getData();
            const message = typeof data === 'string' ? JSON.parse(data).message : data.message;
            expect(message).toBe('User with this email or username already exists');
        });
    });
});

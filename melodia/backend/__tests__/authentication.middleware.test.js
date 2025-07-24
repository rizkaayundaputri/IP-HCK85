const authentication = require('../middlewares/authentication');
const { User } = require('../models');
const { signToken } = require('../helpers/jwt');

describe('Authentication Middleware', () => {
    let req, res, next, user;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    beforeAll(async () => {
        await User.destroy({ where: {} });
        user = await User.create({
            name: 'Test User',
            email: 'authtest@mail.com',
            password: 'password123'
        });
    });

    afterAll(async () => {
        await User.destroy({ where: {} });
    });

    it('should fail without authorization header', async () => {
        await authentication(req, res, next);
        
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Unauthorized',
                message: 'Invalid token'
            })
        );
    });

    it('should fail with invalid token format', async () => {
        req.headers.authorization = 'InvalidFormat';
        
        await authentication(req, res, next);
        
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Unauthorized',
                message: 'Invalid token'
            })
        );
    });

    it('should fail with malformed Bearer token', async () => {
        req.headers.authorization = 'Bearer';
        
        await authentication(req, res, next);
        
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Unauthorized',
                message: 'Invalid token'
            })
        );
    });

    it('should fail with invalid JWT token', async () => {
        req.headers.authorization = 'Bearer invalid-jwt-token';
        
        await authentication(req, res, next);
        
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should fail with valid JWT but non-existent user', async () => {
        const fakeToken = signToken({ id: 999999 });
        req.headers.authorization = `Bearer ${fakeToken}`;
        
        await authentication(req, res, next);
        
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Unauthorized',
                message: 'Invalid token'
            })
        );
    });

    it('should succeed with valid token and existing user', async () => {
        const validToken = signToken({ id: user.id });
        req.headers.authorization = `Bearer ${validToken}`;
        
        await authentication(req, res, next);
        
        expect(req.user).toBeDefined();
        expect(req.user.id).toBe(user.id);
        expect(next).toHaveBeenCalledWith(); // Called without arguments means success
    });

    it('should handle database errors gracefully', async () => {
        // Mock User.findByPk to throw an error
        const originalFindByPk = User.findByPk;
        User.findByPk = jest.fn().mockRejectedValue(new Error('Database error'));
        
        const validToken = signToken({ id: user.id });
        req.headers.authorization = `Bearer ${validToken}`;
        
        await authentication(req, res, next);
        
        expect(next).toHaveBeenCalledWith(expect.any(Error));
        
        // Restore the original method
        User.findByPk = originalFindByPk;
    });

    it('should handle case-sensitive Bearer keyword', async () => {
        const validToken = signToken({ id: user.id });
        req.headers.authorization = `bearer ${validToken}`;
        
        await authentication(req, res, next);
        
        // Should fail because Bearer is case-sensitive in the middleware
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Unauthorized',
                message: 'Invalid token'
            })
        );
    });
});

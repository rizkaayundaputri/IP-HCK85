const errorHandler = require('../middlewares/errorHandler');

describe('Error Handler Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it('should handle Unauthorized errors', () => {
        const error = { name: 'Unauthorized', message: 'Access denied' };
        
        errorHandler(error, req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
    });

    it('should handle BadRequest errors', () => {
        const error = { name: 'BadRequest', message: 'Invalid input' };
        
        errorHandler(error, req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input' });
    });

    it('should handle SequelizeValidationError', () => {
        const error = {
            name: 'SequelizeValidationError',
            errors: [
                { message: 'Name is required' },
                { message: 'Email must be valid' }
            ]
        };
        
        errorHandler(error, req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ 
            message: ['Name is required', 'Email must be valid'] 
        });
    });

    it('should handle SequelizeUniqueConstraintError', () => {
        const error = {
            name: 'SequelizeUniqueConstraintError',
            errors: [{ message: 'email must be unique' }]
        };
        
        errorHandler(error, req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ 
            message: ['email must be unique'] 
        });
    });

    it('should handle Forbidden errors', () => {
        const error = { name: 'Forbidden', message: 'Access forbidden' };
        
        errorHandler(error, req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Access forbidden' });
    });

    it('should handle NotFound errors', () => {
        const error = { name: 'NotFound', message: 'Resource not found' };
        
        errorHandler(error, req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Resource not found' });
    });

    it('should handle JsonWebTokenError', () => {
        const error = { name: 'JsonWebTokenError', message: 'jwt malformed' };
        
        errorHandler(error, req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    });

    it('should handle GoogleTokenError with pem error', () => {
        const error = { 
            name: 'GoogleTokenError', 
            message: 'No pem found for envelop' 
        };
        
        errorHandler(error, req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid google token' });
    });

    it('should handle GoogleTokenError with other errors', () => {
        const error = { 
            name: 'GoogleTokenError', 
            message: 'Some other google error' 
        };
        
        errorHandler(error, req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });

    it('should handle unknown errors with default 500', () => {
        const error = { name: 'UnknownError', message: 'Something went wrong' };
        
        errorHandler(error, req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
});
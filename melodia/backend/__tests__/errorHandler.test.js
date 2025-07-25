const express = require('express');
const errorHandler = require('../middlewares/errorHandler');

describe('Error Handler Middleware', () => {
    it('should handle validation errors', () => {
        const err = {
            name: 'SequelizeValidationError',
            errors: [
                { message: 'Name is required' },
                { message: 'Email is required' }
            ]
        };
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ 
            message: ['Name is required', 'Email is required'] 
        });
    });

    it('should handle custom errors', () => {
        const err = {
            name: 'NotFound',
            message: 'User not found'
        };
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle general errors', () => {
        const err = new Error('Something went wrong');
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ 
            message: 'Internal Server Error' 
        });
    });
});

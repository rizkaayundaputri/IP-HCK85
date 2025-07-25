const request = require('supertest');
const app = require('../app');

describe('UserController Enhanced', () => {
    it('should validate email format on registration', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                name: 'Test User',
                email: 'invalid-email',
                password: 'password123'
            });
        
        expect(response.status).toBe(400);
        expect(Array.isArray(response.body.message)).toBe(true);
    });
    
    it('should validate password strength', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                name: 'Test User',
                email: 'test@mail.com',
                password: '123'
            });
        
        expect(response.status).toBe(400);
        expect(Array.isArray(response.body.message)).toBe(true);
    });
});

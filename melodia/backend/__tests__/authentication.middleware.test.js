const request = require('supertest');
const app = require('../app');

describe('Authentication Middleware', () => {
    it('should require authentication for protected routes', async () => {
        const response = await request(app)
            .get('/songs');
        
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid token');
    });
    
    it('should allow access with valid token', async () => {
        // First register and login to get token
        await request(app)
            .post('/register')
            .send({
                name: 'Test User',
                email: 'authtest@mail.com',
                password: 'password123'
            });
            
        const loginResponse = await request(app)
            .post('/login')
            .send({
                email: 'authtest@mail.com',
                password: 'password123'
            });
            
        const token = loginResponse.body.access_token;
        
        const response = await request(app)
            .get('/songs')
            .set('Authorization', `Bearer ${token}`);
            
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('songs');
    });
});

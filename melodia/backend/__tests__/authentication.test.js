const request = require('supertest');
const app = require('../app');

describe('AuthenticationController', () => {
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                name: 'Test User',
                email: 'testuser@mail.com',
                password: 'password123'
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name', 'Test User');
        expect(response.body).toHaveProperty('email', 'testuser@mail.com');
    });

    it('should fail to register with existing email', async () => {
        await request(app)
            .post('/register')
            .send({
                name: 'Test User',
                email: 'testuser@mail.com',
                password: 'password123'
            });
        const response = await request(app)
            .post('/register')
            .send({
                name: 'Another User',
                email: 'testuser@mail.com',
                password: 'password456'
            });
        expect(response.status).toBe(400);
        expect(Array.isArray(response.body.message)).toBe(true);
        expect(response.body.message).toContain('email must be unique');
    });

    it('should login with correct credentials', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'testuser@mail.com',
                password: 'password123'
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('access_token');
    });

    it('should fail login with wrong password', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'testuser@mail.com',
                password: 'wrongpassword'
            });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid email/password');
    });

    it('should fail login with unregistered email', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'notfound@mail.com',
                password: 'password123'
            });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid email/password');
    });

    it('should fail login with missing fields', async () => {
        const response = await request(app)
            .post('/login')
            .send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email and Password required');
    });
});
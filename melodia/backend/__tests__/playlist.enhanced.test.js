const request = require('supertest');
const app = require('../app');

describe('PlaylistController Enhanced', () => {
    let userToken;
    let playlistId;
    
    beforeAll(async () => {
        // Register and login user
        await request(app)
            .post('/register')
            .send({
                name: 'Playlist Tester',
                email: 'playlistenhanced@mail.com',
                password: 'password123'
            });
            
        const loginResponse = await request(app)
            .post('/login')
            .send({
                email: 'playlistenhanced@mail.com',
                password: 'password123'
            });
            
        userToken = loginResponse.body.access_token;
        
        // Create a playlist
        const playlistResponse = await request(app)
            .post('/playlists')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: 'Test Playlist Enhanced'
            });
            
        playlistId = playlistResponse.body.id;
    });
    
    it('should validate playlist name length', async () => {
        const response = await request(app)
            .post('/playlists')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: ''
            });
        
        expect(response.status).toBe(400);
    });
    
    it('should not allow access to other users playlists', async () => {
        // Create another user
        await request(app)
            .post('/register')
            .send({
                name: 'Another User',
                email: 'another@mail.com',
                password: 'password123'
            });
            
        const anotherLoginResponse = await request(app)
            .post('/login')
            .send({
                email: 'another@mail.com',
                password: 'password123'
            });
            
        const anotherToken = anotherLoginResponse.body.access_token;
        
        const response = await request(app)
            .get(`/playlists/${playlistId}`)
            .set('Authorization', `Bearer ${anotherToken}`);
        
        expect(response.status).toBe(404);
    });
});

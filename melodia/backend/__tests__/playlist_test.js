const request = require('supertest')
const app = require('../app')
const { User, Playlist, Song } = require('../models')

describe('PlaylistController', () => {
  let access_token
  let user
  let playlist
  let song

  beforeAll(async () => {
    await User.destroy({ where: {} })
    await Playlist.destroy({ where: {} })
    await Song.destroy({ where: {} })

    user = await User.create({
      name: 'Playlist Tester',
      email: 'playlisttester@mail.com',
      password: 'playlistpassword'
    })

    const resLogin = await request(app)
      .post('/login')
      .send({ email: 'playlisttester@mail.com', password: 'playlistpassword' })

    access_token = resLogin.body.access_token

    song = await Song.create({
      title: 'Playlist Song',
      artist: 'Playlist Artist',
      coverUrl: 'http://example.com/playlistcover.jpg'
    })

    playlist = await Playlist.create({
      name: 'My Playlist',
      userId: user.id
    })
  })

  afterAll(async () => {
    await Playlist.destroy({ where: {} })
    await Song.destroy({ where: {} })
    await User.destroy({ where: {} })
  })

  describe('POST /playlists', () => {
    it('should create a new playlist', async () => {
      const res = await request(app)
        .post('/playlists')
        .set('Authorization', `Bearer ${access_token}`)
        .send({ name: 'New Playlist' })
      expect(res.statusCode).toBe(201)
      expect(res.body).toHaveProperty('name', 'New Playlist')
      expect(res.body).toHaveProperty('userId', user.id)
    })

    it('should fail to create playlist without name', async () => {
      const res = await request(app)
        .post('/playlists')
        .set('Authorization', `Bearer ${access_token}`)
        .send({})
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('message')
    })
  })

  describe('GET /playlists', () => {
    it('should get all playlists for user', async () => {
      const res = await request(app)
        .get('/playlists')
        .set('Authorization', `Bearer ${access_token}`)
      expect(res.statusCode).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.some(pl => pl.name === 'My Playlist')).toBe(true)
    })
  })

  describe('GET /playlists/:id', () => {
    it('should get playlist by id', async () => {
      const res = await request(app)
        .get(`/playlists/${playlist.id}`)
        .set('Authorization', `Bearer ${access_token}`)
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('id', playlist.id)
      expect(res.body).toHaveProperty('name', playlist.name)
    })

    it('should return 404 if playlist not found', async () => {
      const res = await request(app)
        .get('/playlists/999999')
        .set('Authorization', `Bearer ${access_token}`)
      expect(res.statusCode).toBe(404)
      expect(res.body).toHaveProperty('message')
    })
  })

  describe('PUT /playlists/:id', () => {
    it('should update playlist name', async () => {
      const res = await request(app)
        .put(`/playlists/${playlist.id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .send({ name: 'Updated Playlist' })
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('name', 'Updated Playlist')
    })

    it('should fail to update playlist without name', async () => {
      const res = await request(app)
        .put(`/playlists/${playlist.id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .send({})
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('message')
    })
  })

  describe('POST /playlists/:playlistId/songs', () => {
    it('should add song to playlist', async () => {
      const res = await request(app)
        .post(`/playlists/${playlist.id}/songs`)
        .set('Authorization', `Bearer ${access_token}`)
        .send({ songId: song.id })
      expect(res.statusCode).toBe(201)
      expect(res.body).toHaveProperty('message', 'Song added to playlist')
    })

    it('should fail to add song without songId', async () => {
      const res = await request(app)
        .post(`/playlists/${playlist.id}/songs`)
        .set('Authorization', `Bearer ${access_token}`)
        .send({})
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('message')
    })

    it('should fail to add song to non-existent playlist', async () => {
      const res = await request(app)
        .post('/playlists/999999/songs')
        .set('Authorization', `Bearer ${access_token}`)
        .send({ songId: song.id })
      expect([400,404]).toContain(res.statusCode)
      expect(res.body).toHaveProperty('message')
    })
  })

  describe('DELETE /playlists/:id', () => {
    it('should delete playlist', async () => {
      const newPlaylist = await Playlist.create({ name: 'Delete Me', userId: user.id })
      const res = await request(app)
        .delete(`/playlists/${newPlaylist.id}`)
        .set('Authorization', `Bearer ${access_token}`)
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('message')
    })

    it('should return 404 if playlist not found', async () => {
      const res = await request(app)
        .delete('/playlists/999999')
        .set('Authorization', `Bearer ${access_token}`)
      expect(res.statusCode).toBe(404)
      expect(res.body).toHaveProperty('message')
    })
  })

  // Tambahan: test get playlist with songs
  describe('GET /playlists/:id', () => {
    it('should get playlist with songs array', async () => {
      await playlist.addSong(song.id)
      const res = await request(app)
        .get(`/playlists/${playlist.id}`)
        .set('Authorization', `Bearer ${access_token}`)
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('songs')
      expect(Array.isArray(res.body.songs)).toBe(true)
      expect(res.body.songs.some(s => s.id === song.id)).toBe(true)
    })
  })
})
const request = require('supertest')
const app = require('../app')
const { Song, User } = require('../models')

describe('SongController', () => {
  let access_token
  let testSong

  beforeAll(async () => {
    await User.destroy({ where: { email: 'songtester@mail.com' } })
    await User.create({
      name: 'Song Tester',
      email: 'songtester@mail.com',
      password: 'songpassword'
    })

    const resLogin = await request(app)
      .post('/login')
      .send({ email: 'songtester@mail.com', password: 'songpassword' })

    access_token = resLogin.body.access_token

    await Song.destroy({ where: {} })
    testSong = await Song.create({
      title: 'Test Song',
      artist: 'Test Artist',
      coverUrl: 'http://example.com/cover.jpg'
    })
    await Song.create({
      title: 'Another Song',
      artist: 'Another Artist',
      coverUrl: 'http://example.com/cover2.jpg'
    })
  })

  afterAll(async () => {
    await Song.destroy({ where: {} })
    await User.destroy({ where: { email: 'songtester@mail.com' } })
  })

  describe('GET /songs', () => {
    it('should get all songs', async () => {
      const res = await request(app)
        .get('/songs')
        .set('Authorization', `Bearer ${access_token}`)
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('songs')
      expect(Array.isArray(res.body.songs)).toBe(true)
      expect(res.body.songs.length).toBeGreaterThan(0)
    })

    it('should search songs by title', async () => {
      const res = await request(app)
        .get('/songs?search=Test')
        .set('Authorization', `Bearer ${access_token}`)
      expect(res.statusCode).toBe(200)
      expect(res.body.songs.some(song => song.title.includes('Test'))).toBe(true)
    })

    it('should search songs by artist', async () => {
      const res = await request(app)
        .get('/songs?search=Another')
        .set('Authorization', `Bearer ${access_token}`)
      expect(res.statusCode).toBe(200)
      expect(res.body.songs.some(song => song.artist.includes('Another'))).toBe(true)
    })
  })

})
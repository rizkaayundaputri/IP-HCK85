const request = require('supertest')
const app = require('../app')
const { User } = require('../models')

describe('UserController', () => {
  let testUser

  beforeAll(async () => {
     await User.destroy({ where : {} })
    testUser = await User.create({
      name: 'Test User',
      email: 'testuser@mail.com',
      password: 'testpassword'
    })
  })

  afterAll(async () => {
    await User.destroy({ where: {  } })
  })

  describe('POST /register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        name: 'User',
        email: 'testuser2@mail.com',
        password: 'newpassword'
      })
    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('id', expect.any(Number))
    expect(res.body.email).toBe('testuser2@mail.com')
    expect(res.body.name).toBe('User')
  })
  it('should fail to register with existing email', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          name: 'User',
          email: 'testuser@mail.com', // already exists
          password: 'newpassword'
        })
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('message')
    })

    it('should fail to register with missing fields', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          email: 'nouser@mail.com'
        })
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('message')
    })
})

  describe('POST /login', () => {
    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          email: 'testuser@mail.com',
          password: 'testpassword'
        })
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('access_token')
    })
    it('should fail login with wrong password', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          email: 'testuser@mail.com',
          password: 'wrongpassword'
        })
      expect(res.statusCode).toBe(401)
      expect(res.body).toHaveProperty('message', 'Invalid email/password')
    })

    it('should fail login with unregistered email', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          email: 'notfound@mail.com',
          password: 'any'
        })
      expect(res.statusCode).toBe(401)
      expect(res.body).toHaveProperty('message', 'Invalid email/password')
    })

    it('should fail login with missing fields', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          email: ''
        })
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('message')
    })
    
  })
})
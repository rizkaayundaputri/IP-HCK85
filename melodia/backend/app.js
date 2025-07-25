if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const errorHandler = require('./middlewares/errorHandler')
const authentication = require('./middlewares/authentication')
const songController = require('./controllers/songController')
const UserController = require('./controllers/userController')
const app = express()
const cors = require('cors')
const PlaylistController = require('./controllers/playlistController')

app.use(express.json())
app.use(cors())

app.post('/register',UserController.register)
app.post('/login', UserController.login)
app.post('/google-login', UserController.googleLogin);

app.use(authentication)
app.get('/songs', songController.findAll)
app.get('/songs/:id', songController.findById)    
app.get('/playlists', PlaylistController.findAll)
app.get('/playlists/:id', PlaylistController.findById)
app.delete('/playlists/:id', PlaylistController.deleteSong)
app.post('/playlists', PlaylistController.addPlaylist)
app.put('/playlists/:id', PlaylistController.updatePlaylist)
app.post('/ai/gemini-lyric',PlaylistController.generateLyric)
app.post('/playlists/:playlistId/songs', PlaylistController.addSongToPlaylist)

app.use(errorHandler) 

module.exports = app
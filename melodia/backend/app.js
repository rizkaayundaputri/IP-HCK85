require('dotenv').config()
const express = require('express')
const errorHandler = require('./middlewares/errorHandler')
const authentication = require('./middlewares/authentication')
const songController = require('./controllers/songController')
const UserController = require('./controllers/userController')
const app = express()
const port = process.env.PORT || 3000
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
app.post('/playlists/:id/songs', PlaylistController.addSong)
app.post('/playlists', PlaylistController.addPlaylist)
app.put('/playlists/:id', PlaylistController.updatePlaylist)

app.use(errorHandler) 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
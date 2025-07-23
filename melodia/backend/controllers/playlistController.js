const { Playlist, Song } = require('../models')

class PlaylistController {
  static async findAll(req, res, next) {
    try {
      const userId = req.user.id
      const playlists = await Playlist.findAll({
        where: { userId },
        include: [Song]
      })
      res.status(200).json(playlists)
    } catch (error) {
      next(error)
    }
  }

  static async addSong(req, res, next) {
    try {
      const userId = req.user.id
      const { songId,name } = req.body
      if (!songId) throw { name: "BadRequest", message: "Song ID required" }

      const playlist = await Playlist.create({ userId, songId,name })
      res.status(201).json(playlist)
    } catch (error) {
      next(error)
    }
  }
    static async findById(req, res, next) {
        try {
        const userId = req.user.id
        const { id } = req.params
        const playlist = await Playlist.findOne({
            where: { id, userId },
            include: [Song]
        })
        if (!playlist) throw { name: "NotFound", message: "Playlist not found" }
        res.status(200).json(playlist)
        } catch (error) {
        next(error)
        }
    }
    
  static async deleteSong(req, res, next) {
    try {
      const userId = req.user.id
      const { id } = req.params // id playlist
      const playlist = await Playlist.findOne({ where: { id, userId } })
      if (!playlist) throw { name: "NotFound", message: "Playlist item not found" }

      await playlist.destroy()
      res.status(200).json({ message: "Song removed from playlist" })
    } catch (error) {
      next(error)
    }
  }

  static async addPlaylist(req, res, next) {
  try {
    const userId = req.user.id
    const { name } = req.body
    if (!name) throw { name: "BadRequest", message: "Playlist name required" }

    const playlist = await Playlist.create({ userId, name })
    res.status(201).json(playlist)
  } catch (error) {
    next(error)
  }
}

  static async updatePlaylist(req, res, next) {
  try {
    const userId = req.user.id
    const { id } = req.params
    const { name } = req.body
    if (!name) throw { name: "BadRequest", message: "Playlist name required" }

    const playlist = await Playlist.findOne({ where: { id, userId } })
    if (!playlist) throw { name: "NotFound", message: "Playlist not found" }

    playlist.name = name
    await playlist.save()
    res.status(200).json(playlist)
  } catch (error) {
    next(error)
  }
}


}

module.exports = PlaylistController
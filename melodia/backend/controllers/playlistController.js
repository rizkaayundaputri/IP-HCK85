const { Playlist, Song } = require('../models')
const { GoogleGenAI } = require("@google/genai");

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

  static async findById(req, res, next) {
        try {
            const playlist = await Playlist.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            },
            include: {
                model: Song,
                attributes: ['id', 'title', 'artist', 'coverUrl'],
                through: { attributes: [] } // hilangkan data pivot table PlaylistSongs
            }
            })

            if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' })
            }

            res.status(200).json({
            id: playlist.id,
            name: playlist.name,
            songs: playlist.Songs
            })
        } catch (error) {
            next(error)
            console.log(error)
        }
        }

  // static async addSong(req, res, next) {
  //   try {
  //     const userId = req.user.id
  //     const { songId,name } = req.body
  //     if (!songId) throw { name: "BadRequest", message: "Song ID required" }

  //     const playlist = await Playlist.create({ userId, songId,name })
  //     res.status(201).json(playlist)
  //   } catch (error) {
  //     next(error)
  //   }
  // }
    // static async findById(req, res, next) {
    //     try {
    //     const userId = req.user.id
    //     const { id } = req.params
    //     const playlist = await Playlist.findOne({
    //         where: { id, userId },
    //         include: [Song]
    //     })
    //     if (!playlist) throw { name: "NotFound", message: "Playlist not found" }
    //     res.status(200).json(playlist)
    //     } catch (error) {
    //     next(error)
    //     }
    // }
    
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

static async generateLyric(req, res, next) {
  try {
    const { title, artist } = req.body;
    if (!title || !artist) throw { name: "BadRequest", message: "Title and artist are required" };

    const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
    console.log(title, artist);
    
    const prompt = `
      You are a lyrics retrieval assistant.

      Your task is to return the **complete, original lyrics** for the song titled: "${title}" by "${artist}".

      Instructions:
      - Output **only** the official lyrics, **exactly as published** (no edits, no paraphrasing).
      - Start **immediately** with the **first line** of the song.
      - Preserve the original formatting: line breaks, section breaks (double line breaks between verses, choruses, etc.).
      - Do **not** add or invent any lyrics.
      - Do **not** include explanations, titles, commentary, or formatting (like quotes, bold, or markdown).
      - Do **not** include metadata (like album, genre, etc).
      - Your output must be **100% identical** to the official published lyrics.
      - If you cannot find the lyrics, respond with "Lyrics not found".
      - If the song has multiple versions, return the lyrics for the most popular version.
      - If the song is instrumental or has no lyrics, respond with "This song has no lyrics"
      - DON'T BE CREATIVE PLEASE.
      `;

    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    let fullText = '';
    for await (const chunk of stream) {
      fullText += chunk.text;
    }
    const cleanLyric = fullText
      .replace(/```[\s\S]*?```/g, '') 
      .replace(/\*{1,2}/g, '')       
      .trim();

    res.status(200).json({ lyric: cleanLyric });
  } catch (error) {
    next(error);
  }
}

  static async addSongToPlaylist(req, res, next) {
    try {
      console.log("Adding song to playlist...");
      const userId = req.user.id
      const { playlistId } = req.params
      const { songId } = req.body
      console.log("User ID:", userId, "Playlist ID:", playlistId)

      if (!playlistId || !songId) throw { name: "BadRequest", message: "Playlist ID and Song ID required" }

      // Pastikan playlist milik user
      const playlist = await Playlist.findOne({ where: { id: playlistId, userId } })
      if (!playlist) throw { name: "NotFound", message: "Playlist not found" }

      // Tambahkan lagu ke playlist (pastikan relasi sudah ada di model)
      await playlist.addSong(songId)
      res.status(201).json({ message: "Song added to playlist" })
    } catch (error) {
      console.log(error);
      
      next(error)
    }
  }
}

module.exports = PlaylistController
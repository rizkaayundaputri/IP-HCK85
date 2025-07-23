const { Op } = require('sequelize')
const { Song } = require('../models')

class SongController {

    static async findAll(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 20;
            const offset = (page - 1) * limit;
            const search = req.query.search || '';

            let where = {};
            if (search) {
                where = {
                    [Op.or]: [
                        { title: { [Op.iLike]: `%${search}%` } },
                        { artist: { [Op.iLike]: `%${search}%` } }
                    ]
                }
            }

            const { count, rows } = await Song.findAndCountAll({
                where,
                limit,
                offset
            });

            res.status(200).json({
                songs: rows,
                total: count,
                page,
                totalPages: Math.ceil(count / limit)
            });
        } catch (error) {
            next(error)
        }
    }

    static async findById(req, res, next) {
        try {
            const song = await Song.findByPk(req.params.id)
            if (!song) {
                return res.status(404).json({ message: 'Song not found' })
            }
            res.status(200).json(song)
        } catch (error) {
            next(error)
            console.log(error);
        }
    }

}

module.exports = SongController
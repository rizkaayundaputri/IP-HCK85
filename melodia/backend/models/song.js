'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Song.hasMany(models.Lyric, { foreignKey: 'songId' });
      Song.hasMany(models.PlaylistSong, { foreignKey: 'songId' });
      Song.belongsToMany(models.Playlist, { through: models.PlaylistSong, foreignKey: 'songId' }); // ✅ tambahkan ini
    }

  }
  Song.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Title is required' },
        notNull:{ msg: 'Title is required' }
      }
    },
    artist: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Artist is required' },
        notNull: { msg: 'Artist is required' }
      }
    },
    coverUrl: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Song',
  });
  return Song;
};
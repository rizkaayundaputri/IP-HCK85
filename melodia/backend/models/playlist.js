'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Playlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Playlist.belongsTo(models.User, { foreignKey: 'userId' });
      Playlist.hasMany(models.PlaylistSong, { foreignKey: 'playlistId' });
      Playlist.belongsToMany(models.Song, { through: models.PlaylistSong, foreignKey: 'playlistId' }); 
    }
  }
  Playlist.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Playlist name cannot be empty' }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Playlist',
  });
  return Playlist;
};
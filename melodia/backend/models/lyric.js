'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lyric extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Lyric.belongsTo(models.Song, { foreignKey: 'songId' })
    }
  }
  Lyric.init({
    songId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Lyric content is required' },
        notNull: { msg: 'Lyric content is required' }
      }
    },
    chords: DataTypes.TEXT,
    source: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Lyric',
  });
  return Lyric;
};
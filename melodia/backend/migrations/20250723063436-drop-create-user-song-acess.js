'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserSongAcesses'); // Ganti 'Favorites' sesuai nama tabel yang ingin dihapus
  },

  async down(queryInterface, Sequelize) {
    // Kalau ingin undo drop, kamu bisa define kembali struktur tabel
    await queryInterface.createTable('UserSongAcesses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,        
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
        
      },
      songId: {
        type: Sequelize.INTEGER,        
        allowNull: false,
        references: {
          model: 'Songs',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      isFavorite: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  }
};

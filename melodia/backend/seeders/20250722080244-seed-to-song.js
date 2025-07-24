require('dotenv').config()
'use strict';
const axios = require('axios');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   const allSongs = [];

  for (let i = 0; i < 2; i++) {
    const offset = i * 100;

    const response = await axios.get('https://api.deezer.com/chart', {
      params: {
        limit: 100,
        index: offset
      }
    });

    const batch = response.data.tracks.data.map(song => ({
      title: song.title,
      artist: song.artist.name,
      coverUrl: song.album.cover,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    allSongs.push(...batch);
  }

  await queryInterface.bulkInsert('Songs', allSongs, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Songs', null, {
      truncate: true,
      restartIdentity: true
    });
  }
};

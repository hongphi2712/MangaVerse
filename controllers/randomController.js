const mangadexService = require('../services/mangadex');

exports.getRandomManga = async (req, res) => {
  try {
    const manga = await mangadexService.getRandomManga();
    res.redirect(`/manga/${manga.id}`);
  } catch (error) {
    console.error('Error getting random manga:', error.message);
    res.redirect('/');
  }
};
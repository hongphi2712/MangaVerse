const {
    getLatestManga,
    getPopularManga,
    getLatestUpdates,
    getTopRatedManga,
  } = require('./manga');
  const {
    getMangaById,
    getRelatedManga,
    getRandomManga,
  } = require('./manga');
  const { getMangaChapters, getChapterPages } = require('./chapters');
  const { searchManga } = require('./search');
  const { getGenres, getMangaByGenre } = require('./genres');
  const { getMangaByStatus } = require('./manga');
  
  module.exports = {
    getLatestManga,
    getMangaById,
    getMangaChapters,
    getChapterPages,
    getPopularManga,
    getLatestUpdates,
    getTopRatedManga,
    searchManga,
    getGenres,
    getMangaByGenre,
    getMangaByStatus,
    getRandomManga,
    getRelatedManga,
  };
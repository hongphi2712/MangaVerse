const NodeCache = require('node-cache');
const mangadexService = require('../services/mangadex');

const apiCache = new NodeCache({ stdTTL: 900, checkperiod: 120 });

exports.searchManga = async (req, res) => {
  try {
    const query = req.query.keyword;
    if (!query) return res.redirect('/');

    const cacheKey = `search_${query}`;
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      console.log(`Using cached data for search query "${query}"`);
      return res.render('pages/search-results', {
        ...cachedData,
        title: `Search Results for "${query}" | MangaVerse`,
        metaDescription: `Browse search results for "${query}" at MangaVerse`
      });
    }

    const results = await mangadexService.searchManga(query);

    const data = {
      results,
      query
    };

    apiCache.set(cacheKey, data);

    res.render('pages/search-results', {
      ...data,
      title: `Search Results for "${query}" | MangaVerse`,
      metaDescription: `Browse search results for "${query}" at MangaVerse`
    });
  } catch (error) {
    console.error('Error searching manga:', error.message);
    res.render('pages/search-results', {
      results: [],
      query: req.query.keyword || '',
      title: 'Search Results | MangaVerse',
      metaDescription: 'Browse search results at MangaVerse'
    });
  }
};
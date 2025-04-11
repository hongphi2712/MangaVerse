const api = require('./api');
const { formatManga } = require('./formatters');

async function searchManga(query, limit = 20) {
  try {
    const response = await api.get('/manga', {
      params: {
        title: query,
        limit,
        includes: ['cover_art'],
      },
    });

    return response.data.data.map(formatManga);
  } catch (error) {
    console.error(`Error searching manga with query "${query}":`, error);
    return [];
  }
}

module.exports = { searchManga };
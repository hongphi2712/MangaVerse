const api = require('./api');
const { formatManga } = require('./formatters');

async function getThemes() {
  try {
    const response = await api.get('/manga/tag');
    return response.data.data
      .filter((tag) => tag.attributes.group === 'theme')
      .map((tag) => ({
        id: tag.id,
        name: tag.attributes.name.en || Object.values(tag.attributes.name)[0],
        slug: tag.id,
      }));
  } catch (error) {
    console.error('Error fetching themes :', error);
    return [];
  }
}
async function getMangaByTheme(themeId, page = 1, limit = 24) {
  try {
    const offset = (page - 1) * limit;
    const response = await api.get('/manga', {
      params: {
        includedTags: [themeId],
        limit,
        offset,
        includes: ['cover_art'],
      },
    });

    return {
      mangas: response.data.data.map(formatManga),
      total: response.data.total,
      limit,
      offset,
    };
  } catch (error) {
    console.error(`Error fetching manga by theme ${themeId}:`, error);
    return { mangas: [], total: 0, limit, offset };
  }
}

module.exports = { getThemes, getMangaByTheme };
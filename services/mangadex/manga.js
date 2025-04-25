const api = require('./api');
const { formatManga, formatMangaDetails } = require('./formatters');

async function getLatestManga(page = 1, limit = 100) {
  try {
    const offset = (page - 1) * limit;
    const response = await api.get('/manga', {
      params: {
        limit,
        offset,
        includes: ['cover_art'],
        order: { latestUploadedChapter: 'desc' },
      },
    });

    return {
      mangas: response.data.data.map(formatManga),
      total: response.data.total,
      limit,
      offset,
    };
  } catch (error) {
    console.error('Error fetching manga list:', error);
    return { mangas: [], total: 0, limit, offset };
  }
}

async function getPopularManga(limit = 10) {
  try {
    const response = await api.get('/manga', {
      params: {
        limit,
        includes: ['cover_art'],
        order: { followedCount: 'desc' },
      },
    });

    return response.data.data.map(formatManga);
  } catch (error) {
    console.error('Error fetching popular manga:', error);
    return [];
  }
}

async function getLatestUpdates(limit = 10) {
  try {
    const response = await api.get('/manga', {
      params: {
        limit,
        includes: ['cover_art'],
        order: { latestUploadedChapter: 'desc' },
      },
    });

    return response.data.data.map(formatManga);
  } catch (error) {
    console.error('Error fetching latest updates manga:', error);
    return [];
  }
}

async function getTopRatedManga(limit = 15) {
  try {
    // Thêm các tham số để tối ưu hóa request
    const response = await api.get('/manga', {
      params: {
        limit,
        includes: ['cover_art', 'author'],
        order: { rating: 'desc' },
        contentRating: ['safe', 'suggestive', 'erotica'],
        hasAvailableChapters: true,
        availableTranslatedLanguage: ['en']
      },
    });

    // Thêm cache cho kết quả
    return response.data.data.map(formatManga);
  } catch (error) {
    console.error('Error fetching top rated manga:', error);
    return [];
  }
}

async function getMangaById(mangaId) {
  try {
    const response = await api.get(`/manga/${mangaId}`, {
      params: {
        includes: ['cover_art', 'author', 'artist'],
      },
    });
    return formatMangaDetails(response.data.data);
  } catch (error) {
    console.error(`Error fetching manga with ID ${mangaId}:`, error);
    throw error;
  }
}

async function getRelatedManga(mangaId, limit = 5) {
  try {
    const manga = await getMangaById(mangaId);

    if (!manga.tags || manga.tags.length === 0) {
      return [];
    }

    const tagIds = manga.tags.slice(0, 2).map((tag) => tag.id);

    const response = await api.get('/manga', {
      params: {
        includedTags: tagIds,
        limit: limit + 1,
        includes: ['cover_art'],
      },
    });

    return response.data.data
      .filter((m) => m.id !== mangaId)
      .slice(0, limit)
      .map(formatManga);
  } catch (error) {
    console.error(`Error fetching related manga for ${mangaId}:`, error);
    return [];
  }
}

async function getRandomManga() {
  try {
    const response = await api.get('/manga/random', {
      params: { includes: ['cover_art'] },
    });

    return formatManga(response.data.data);
  } catch (error) {
    console.error('Error fetching random manga:', error);
    throw error;
  }
}

async function getMangaByStatus(status, page = 1, limit = 44) {
  try {
    const offset = (page - 1) * limit;
    let params = {
      limit,
      offset,
      includes: ['cover_art'],
    };

    switch (status) {
      case 'new-manga':
        params.order = { createdAt: 'desc' };
        break;
      case 'coming-soon':
        params.status = ['announced'];
        break;
      case 'on-going':
        params.status = ['ongoing'];
        break;
      case 'popular':
        params.order = { followedCount: 'desc' };
        break;
      case 'top-rated':
        params.order = { rating: 'desc' };
        break;
      case 'latest-updates':
        params.order = { latestUploadedChapter: 'desc' };
        break;
      case 'completed':
        params.status = ['completed'];
        break;
      default:
        throw new Error(`Invalid status: ${status}`);
    }

    const response = await api.get('/manga', { params });

    return {
      mangas: response.data.data.map(formatManga),
      total: response.data.total,
      limit,
      offset,
    };
  } catch (error) {
    console.error(`Error fetching manga by status ${status}:`, error);
    return { mangas: [], total: 0, limit, offset };
  }
}


module.exports = {
  getLatestManga,
  getPopularManga,
  getLatestUpdates,
  getTopRatedManga,
  getMangaById,
  getRelatedManga,
  getRandomManga,
  getMangaByStatus,
};
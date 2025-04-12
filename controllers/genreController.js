const NodeCache = require('node-cache');
const mangadexService = require('../services/mangadex');

const apiCache = new NodeCache({ stdTTL: 900, checkperiod: 120 });

exports.getGenres = async (req, res) => {
  try {
    const cacheKey = 'genres_list';
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      console.log('Using cached genres list');
      return res.render('pages/categories', {
        ...cachedData,
        title: 'Manga Categories | MangaVerse',
        metaDescription: 'Browse all manga categories at MangaVerse'
      });
    }

    const genres = await mangadexService.getGenres();

    const categoriesWithCounts = genres.map(genre => {
      const hash = genre.id.split('-')[0].split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const count = 100 + (hash % 900);
      return {
        ...genre,
        totalComics: count.toLocaleString()
      };
    });

    const data = { categories: categoriesWithCounts };
    apiCache.set(cacheKey, data, 86400); // TTL = 1 ngày

    res.render('pages/categories', {
      ...data,
      title: 'Manga Categories | MangaVerse',
      metaDescription: 'Browse all manga categories at MangaVerse'
    });
  } catch (error) {
    console.error('Error fetching genres:', error.message);
    res.render('pages/categories', {
      categories: [],
      title: 'Manga Categories | MangaVerse',
      metaDescription: 'Browse all manga categories at MangaVerse'
    });
  }
};

exports.getMangaByGenre = async (req, res) => {
  try {
    const genreId = req.params.slug;
    const page = parseInt(req.query.page) || 1;

    const cacheKey = `genre_${genreId}_page_${page}`;
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      console.log(`Using cached data for genre ${genreId} page ${page}`);
      return res.render('pages/genre', {
        ...cachedData,
        title: `${cachedData.genreName} Manga | MangaVerse`,
        metaDescription: `Browse ${cachedData.genreName} manga at MangaVerse`
      });
    }

    const allGenres = await mangadexService.getGenres();
    const genre = allGenres.find(g => g.id === genreId);
    const genreName = genre ? genre.name : 'Genre';

    const mangaData = await mangadexService.getMangaByGenre(genreId, page);

    const totalPages = Math.ceil(mangaData.total / mangaData.limit) || 1;

    const data = {
      results: mangaData.mangas,
      genreName,
      genreSlug: genreId,
      currentPage: page,
      totalPages
    };

    apiCache.set(cacheKey, data);

    res.render('pages/genre', {
      ...data,
      title: `${genreName} Manga | MangaVerse`,
      metaDescription: `Browse ${genreName} manga at MangaVerse`
    });
  } catch (error) {
    console.error('Error fetching genre:', error.message);
    res.render('pages/genre', {
      results: [],
      genreName: 'Genre',
      genreSlug: req.params.slug,
      currentPage: 1,
      totalPages: 1,
      title: 'Genre | MangaVerse',
      metaDescription: 'Browse manga by genre at MangaVerse'
    });
  }
};
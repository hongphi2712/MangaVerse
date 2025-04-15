const NodeCache = require('node-cache');
const mangadexService = require('../services/mangadex')

const apiCache = new NodeCache({ stdTTL: 900, checkperiod: 120 });

exports.getHome = async (req, res) => {
  try {
    const cacheKey = 'home_page';
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      console.log('Using cached home page data');
      return res.render('pages/index', {
        ...cachedData,
        title: 'MangaVerse - Discover Amazing Manga',
        metaDescription: 'MangaVerse is the ultimate place for manga enthusiasts to explore and discover new series'
      });
    }

    const featuredImages = [
      '/images/welcome1.jfif',
      '/images/welcome2.jfif',
      '/images/welcome3.jfif'
    ];

    const [popular, latestUploadedChapter, topRated] = await Promise.all([
      mangadexService.getPopularManga(30),
      mangadexService.getLatestUpdates(24),
      mangadexService.getTopRatedManga(20)
    ]);

    const data = {
      popular,
      latestUploadedChapter,
      topRated,
      featuredImages
    };

    apiCache.set(cacheKey, data);

    res.render('pages/index', {
      ...data,
      title: 'MangaVerse - Discover Amazing Manga',
      metaDescription: 'MangaVerse is the ultimate place for manga enthusiasts to explore and discover new series'
    });
  } catch (error) {
    console.error('Error in home route:', error.message);
    res.render('pages/index', {
      popular: [],
      latestUploadedChapter: [],
      topRated: [],
      featuredImages: [
        '/images/welcome1.jfif'
      ],
      title: 'MangaVerse - Discover Amazing Manga',
      metaDescription: 'MangaVerse is the ultimate place for manga enthusiasts to explore and discover new series'
    });
  }
};
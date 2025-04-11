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
      'https://images.unsplash.com/photo-1602416222941-a72a356dab04?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxtYW5nYSUyMGNvdmVycyUyMGFuaW1lfGVufDB8fHx8MTc0NDM2MTk0NHww&ixlib=rb-4.0.3&fit=fillmax&h=1200&w=800',
      'https://images.unsplash.com/photo-1519638399535-1b036603ac77?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxtYW5nYSUyMGNvdmVycyUyMGFuaW1lfGVufDB8fHx8MTc0NDM2MTk0NHww&ixlib=rb-4.0.3&fit=fillmax&h=1200&w=800',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxtYW5nYSUyMGNvdmVycyUyMGFuaW1lfGVufDB8fHx8MTc0NDM2MTk0NHww&ixlib=rb-4.0.3&fit=fillmax&h=1200&w=800',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw0fHxtYW5nYSUyMGNvdmVycyUyMGFuaW1lfGVufDB8fHx8MTc0NDM2MTk0NHww&ixlib=rb-4.0.3&fit=fillmax&h=1200&w=800'
    ];

    const [popular, recent, topRated] = await Promise.all([
      mangadexService.getPopularManga(12),
      mangadexService.getRecentManga(10),
      mangadexService.getTopRatedManga(6)
    ]);

    const data = {
      popular,
      recent,
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
      recent: [],
      topRated: [],
      featuredImages: [
        'https://images.unsplash.com/photo-1602416222941-a72a356dab04?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxtYW5nYSUyMGNvdmVycyUyMGFuaW1lfGVufDB8fHx8MTc0NDM2MTk0NHww&ixlib=rb-4.0.3&fit=fillmax&h=1200&w=800'
      ],
      title: 'MangaVerse - Discover Amazing Manga',
      metaDescription: 'MangaVerse is the ultimate place for manga enthusiasts to explore and discover new series'
    });
  }
};
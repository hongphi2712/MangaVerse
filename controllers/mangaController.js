const NodeCache = require('node-cache');
const mangadexService = require('../services/mangadex');

const apiCache = new NodeCache({ stdTTL: 900, checkperiod: 120 });

exports.getMangaDetails = async (req, res) => {
  try {
    const mangaId = req.params.slug;
    const cacheKey = `manga_details_${mangaId}`;
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      console.log(`Using cached data for manga ${mangaId}`);
      return res.render('pages/manga-details', {
        ...cachedData,
        title: `${cachedData.manga.title} | MangaVerse`,
        metaDescription: `Read ${cachedData.manga.title} and explore chapters at MangaVerse`,
        metaImage: cachedData.manga.thumbnail || null
      });
    }

    const [manga, chapters, related] = await Promise.all([
      mangadexService.getMangaById(mangaId),
      mangadexService.getMangaChapters(mangaId),
      mangadexService.getRelatedManga(mangaId, 5)
    ]);

    const data = {
      manga,
      chapters,
      related
    };

    apiCache.set(cacheKey, data);

    res.render('pages/manga-details', {
      ...data,
      title: `${manga.title} | MangaVerse`,
      metaDescription: `Read ${manga.title} and explore chapters at MangaVerse`,
      metaImage: manga.thumbnail || null
    });
  } catch (error) {
    console.error('Error fetching manga data:', error.message);
    res.status(404).render('pages/error', {
      message: 'Manga not found or could not be loaded',
      title: 'Error | MangaVerse',
      metaDescription: 'An error occurred while trying to access manga content'
    });
  }
};

exports.getChapter = async (req, res) => {
  try {
    const { mangaId, chapterId } = req.params;
    const cacheKey = `chapter_${chapterId}`;
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      console.log(`Using cached data for chapter ${chapterId}`);
      return res.render('pages/read', {
        ...cachedData,
        title: `${cachedData.manga.title} - ${cachedData.chapter.title} | MangaVerse`,
        metaDescription: `Read ${cachedData.manga.title} ${cachedData.chapter.title} for free at MangaVerse`,
        metaImage: cachedData.manga.thumbnail || null,
        layout: 'layouts/reader'
      });
    }

    const chapterData = await mangadexService.getChapterPages(chapterId);

    const data = {
      manga: chapterData.manga,
      chapter: chapterData.chapter,
      pages: chapterData.images,
      baseUrl: chapterData.baseUrl,
      prevChapter: chapterData.prevChapter,
      nextChapter: chapterData.nextChapter
    };

    apiCache.set(cacheKey, data, 300);

    res.render('pages/read', {
      ...data,
      title: `${data.manga.title} - ${data.chapter.title} | MangaVerse`,
      metaDescription: `Read ${data.manga.title} ${data.chapter.title} for free at MangaVerse`,
      metaImage: data.manga.thumbnail || null,
      layout: 'layouts/reader'
    });
  } catch (error) {
    console.error('Error fetching chapter data:', error.message);
    res.status(404).render('pages/error', {
      message: 'Chapter not found or could not be loaded',
      title: 'Error | MangaVerse',
      metaDescription: 'An error occurred while trying to access manga chapter'
    });
  }
};
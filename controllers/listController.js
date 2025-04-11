const NodeCache = require('node-cache');
const mangadexService = require('../services/mangadex');

const apiCache = new NodeCache({ stdTTL: 900, checkperiod: 120 });

exports.getMangaList = async (req, res) => {
  try {
    const type = req.params.type;
    const page = parseInt(req.query.page) || 1;

    let listTitle;
    switch (type) {
      case 'truyen-moi': listTitle = 'New Manga'; break;
      case 'sap-ra-mat': listTitle = 'Coming Soon'; break;
      case 'dang-phat-hanh': listTitle = 'Ongoing'; break;
      case 'hoan-thanh': listTitle = 'Completed'; break;
      default: listTitle = 'Manga List';
    }

    const cacheKey = `list_${type}_page_${page}`;
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      console.log(`Using cached data for list ${type} page ${page}`);
      return res.render('pages/list', {
        ...cachedData,
        title: `${listTitle} | MangaVerse`,
        metaDescription: `Browse ${listTitle.toLowerCase()} manga at MangaVerse`
      });
    }

    const mangaData = await mangadexService.getMangaByStatus(type, page);

    const totalPages = Math.ceil(mangaData.total / mangaData.limit) || 1;

    const data = {
      mangas: mangaData.mangas,
      type,
      currentPage: page,
      totalPages
    };

    apiCache.set(cacheKey, data);

    res.render('pages/list', {
      ...data,
      title: `${listTitle} | MangaVerse`,
      metaDescription: `Browse ${listTitle.toLowerCase()} manga at MangaVerse`
    });
  } catch (error) {
    console.error('Error fetching list:', error.message);
    res.render('pages/list', {
      mangas: [],
      type: req.params.type,
      currentPage: 1,
      totalPages: 1,
      title: 'Manga List | MangaVerse',
      metaDescription: 'Browse manga lists at MangaVerse'
    });
  }
};
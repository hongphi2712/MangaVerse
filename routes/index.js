const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeControllers');
const mangaController = require('../controllers/mangaController');
const searchController = require('../controllers/searchController');
const genreController = require('../controllers/genreController');
const listController = require('../controllers/listController');
const randomController = require('../controllers/randomController');

router.get('/', homeController.getHome);
router.get('/manga/:slug', mangaController.getMangaDetails);
router.get('/manga/:mangaId/:chapterId', mangaController.getChapter);
router.get('/search', searchController.searchManga);
router.get('/genres', genreController.getGenres);
router.get('/genres/:slug', genreController.getMangaByGenre);
router.get('/lists/:type', listController.getMangaList);
router.get('/random', randomController.getRandomManga);
router.use('/', require('./proxy'));

module.exports = router;
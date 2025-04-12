const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const routes = require('./routes');
const cors = require('cors');

const dotenv = require('dotenv');

const app = express();
const PORT = process.env.PORT || 3008;

dotenv.config();

app.use(cors());

// Set up EJS and layouts
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', routes);

// 404 page
app.use((req, res) => {
  res.status(404).render('pages/error', { 
    message: 'Page not found',
    title: 'Page Not Found | MangaVerse',
    metaDescription: 'The page you are looking for does not exist'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
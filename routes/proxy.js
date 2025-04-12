const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/cover-proxy/:mangaId/:filename', async (req, res) => {
  const { mangaId, filename } = req.params;
  const imageUrl = `https://uploads.mangadex.org/covers/${mangaId}/${filename}`;

  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    let contentType = 'image/jpeg';
    if (filename.endsWith('.png')) contentType = 'image/png';
    else if (filename.endsWith('.gif')) contentType = 'image/gif';
    else if (filename.endsWith('.webp')) contentType = 'image/webp';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(404).send('Image not found');
  }
});

module.exports = router;

function formatManga(manga) {
    if (!manga || !manga.id) {
      return {
        id: 'unknown',
        title: 'Unknown Manga',
        coverUrl: null,
        slug: 'unknown',
      };
    }
  
    const coverArt = manga.relationships?.find((r) => r.type === 'cover_art');
    const coverFileName = coverArt?.attributes?.fileName || null;
  
    const title =
      manga.attributes?.title?.en ||
      (manga.attributes?.title
        ? Object.values(manga.attributes.title)[0]
        : 'Unknown Manga');
  
    return {
      id: manga.id,
      title: title,
      coverUrl: coverFileName
        ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}`
        : null,
      thumbnail: coverFileName
        ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}.256.jpg`
        : null,
      slug: manga.id,
      status: manga.attributes?.status || 'unknown',
    };
  }
  
  function formatMangaDetails(manga) {
    const basic = formatManga(manga);
  
    if (!manga.attributes) {
      return {
        ...basic,
        description: 'No description available',
        tags: [],
        authors: ['Unknown'],
        year: null,
      };
    }
  
    const description =
      manga.attributes.description?.en ||
      (manga.attributes.description
        ? Object.values(manga.attributes.description)[0]
        : 'No description available');
  
    const tags = (manga.attributes.tags || []).map((tag) => ({
      id: tag.id,
      name:
        tag.attributes?.name?.en ||
        Object.values(tag.attributes?.name || {})[0] ||
        'Unknown',
      slug: tag.id,
    }));
  
    const authors = [];
    const authorRels = manga.relationships.filter(
      (rel) => rel.type === 'author' || rel.type === 'artist'
    );
    authorRels.forEach((rel) => {
      if (rel.attributes?.name) {
        authors.push(rel.attributes.name);
      }
    });
  
    const altTitles = manga.attributes.altTitles || [];
    const otherName =
      altTitles.length > 0
        ? altTitles[0].ja ||
          altTitles[0].jp ||
          Object.values(altTitles[0])[0] ||
          ''
        : '';
  
    return {
      ...basic,
      description,
      tags,
      categories: tags,
      authors: authors.length > 0 ? authors : ['Unknown'],
      year: manga.attributes.year,
      rate: manga.attributes.rating?.bayesian?.toFixed(2) || 'N/A',
      otherName,
      updatedAt: new Date(
        manga.attributes.updatedAt || Date.now()
      ).toLocaleDateString(),
    };
  }
  
  module.exports = { formatManga, formatMangaDetails }; 
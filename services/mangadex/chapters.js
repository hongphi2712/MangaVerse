const api = require('./api');
const { formatManga } = require('./formatters');

async function getMangaChapters(mangaId) {
  try {
    const response = await api.get(`/manga/${mangaId}/feed`, {
      params: {
        limit: 500,
        order: { chapter: 'desc' },
        translatedLanguage: ['en'],
      },
    });

    const chaptersMap = new Map();

    response.data.data.forEach((chapter) => {
      const chapterNum = parseFloat(chapter.attributes.chapter) || 0;

      if (
        !chaptersMap.has(chapterNum) ||
        new Date(chapter.attributes.updatedAt) >
          new Date(chaptersMap.get(chapterNum).updatedAt)
      ) {
        chaptersMap.set(chapterNum, {
          id: chapter.id,
          slug: chapter.id,
          chapter: chapter.attributes.chapter,
          name: chapter.attributes.title || null,
          updatedAt: new Date(chapter.attributes.updatedAt).toLocaleDateString(),
        });
      }
    });

    return Array.from(chaptersMap.values()).sort(
      (a, b) => (parseFloat(b.chapter) || 0) - (parseFloat(a.chapter) || 0)
    );
  } catch (error) {
    console.error(`Error fetching chapters for manga ${mangaId}:`, error);
    return [];
  }
}

async function getChapterPages(chapterId) {
  try {
    const chapterResponse = await api.get(`/chapter/${chapterId}`, {
      params: { includes: ['manga'] },
    });

    const chapterData = chapterResponse.data.data;
    const mangaId = chapterData.relationships.find((r) => r.type === 'manga')
      ?.id;

    if (!mangaId) {
      throw new Error('Manga ID not found in chapter data');
    }

    const mangaResponse = await api.get(`/manga/${mangaId}`, {
      params: { includes: ['cover_art'] },
    });

    const atHomeResponse = await api.get(`/at-home/server/${chapterId}`);
    const baseUrl = atHomeResponse.data.baseUrl;
    const chapterHash = atHomeResponse.data.chapter.hash;
    const images = atHomeResponse.data.chapter.data;

    const chaptersResponse = await api.get(`/manga/${mangaId}/feed`, {
      params: {
        translatedLanguage: ['en'],
        order: { chapter: 'asc' },
        limit: 500,
      },
    });

    const chaptersMap = new Map();

    chaptersResponse.data.data.forEach((chapter) => {
      const chapterNum = parseFloat(chapter.attributes.chapter) || 0;

      if (
        !chaptersMap.has(chapterNum) ||
        new Date(chapter.attributes.updatedAt) >
          new Date(chaptersMap.get(chapterNum).updatedAt)
      ) {
        chaptersMap.set(chapterNum, {
          id: chapter.id,
          number: chapter.attributes.chapter,
          updateDate: new Date(chapter.attributes.updatedAt),
        });
      }
    });

    const sortedChapters = Array.from(chaptersMap.values()).sort(
      (a, b) => (parseFloat(a.number) || 0) - (parseFloat(b.number) || 0)
    );

    const currentChapterNum = parseFloat(chapterData.attributes.chapter) || 0;
    const currentIndex = sortedChapters.findIndex(
      (ch) =>
        parseFloat(ch.number) === currentChapterNum && ch.id === chapterId
    );

    let prevChapter = null;
    let nextChapter = null;

    if (currentIndex > 0) {
      prevChapter = {
        id: sortedChapters[currentIndex - 1].id,
        number: sortedChapters[currentIndex - 1].number,
      };
    }

    if (currentIndex < sortedChapters.length - 1) {
      nextChapter = {
        id: sortedChapters[currentIndex + 1].id,
        number: sortedChapters[currentIndex + 1].number,
      };
    }

    return {
      images,
      baseUrl: `${baseUrl}/data/${chapterHash}/`,
      chapter: {
        id: chapterId,
        chapter: chapterData.attributes.chapter,
        title:
          chapterData.attributes.title ||
          `Chapter ${chapterData.attributes.chapter}`,
      },
      manga: formatManga(mangaResponse.data.data),
      prevChapter,
      nextChapter,
    };
  } catch (error) {
    console.error(`Error fetching pages for chapter ${chapterId}:`, error);
    throw error;
  }
}

module.exports = { getMangaChapters, getChapterPages };
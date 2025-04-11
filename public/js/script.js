//  Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const searchBar = document.getElementById('searchBar');
  const scrollContainers = document.querySelectorAll('.scroll-container');
  const viewMoreLinks = document.querySelectorAll('.view-more-link');
  const autoScrollWrapper = document.querySelector('.auto-scroll-wrapper');

  // Form submission
  if (searchBar) {
    const form = searchBar.closest('form');
    if (form) {
      form.addEventListener('submit', (e) => {
        if (searchBar.value.trim() === '') {
          e.preventDefault();
        }
      });
    }
  }

  // Smooth scrolling for horizontal containers
  if (scrollContainers.length > 0) {
    scrollContainers.forEach(container => {
      let isDown = false;
      let startX;
      let scrollLeft;

      container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.classList.add('grabbing');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      });

      container.addEventListener('mouseleave', () => {
        isDown = false;
        container.classList.remove('grabbing');
      });

      container.addEventListener('mouseup', () => {
        isDown = false;
        container.classList.remove('grabbing');
      });

      container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
      });

      // Add touch support for mobile
      container.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length > 0) {
          startX = e.touches[0].pageX - container.offsetLeft;
          scrollLeft = container.scrollLeft;
        }
      });

      container.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches.length > 0) {
          const x = e.touches[0].pageX - container.offsetLeft;
          const walk = (x - startX) * 2;
          container.scrollLeft = scrollLeft - walk;
        }
      });
    });
  }

  // Set up auto scrolling for Popular Now
  if (autoScrollWrapper) {
    // Only set up the auto-scroll animation if there are enough cards
    const cards = autoScrollWrapper.querySelectorAll('.card:not(.duplicate)');
    if (cards.length > 6) {
      // Calculate the total width of all cards
      const cardWidth = cards.length > 0 ? cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight) : 200;
      const totalWidth = cardWidth * cards.length;
      
      // Update animation duration based on content
      const scrollDuration = Math.max(30, totalWidth / 50); // Adjust speed factor
      autoScrollWrapper.style.animationDuration = `${scrollDuration}s`;
      
      // Pause animation on hover
      autoScrollWrapper.addEventListener('mouseenter', () => {
        autoScrollWrapper.style.animationPlayState = 'paused';
      });
      
      autoScrollWrapper.addEventListener('mouseleave', () => {
        autoScrollWrapper.style.animationPlayState = 'running';
      });
      
      // Make sure animation is running
      autoScrollWrapper.style.animationPlayState = 'running';
    } else {
      // Remove animation for small collections
      autoScrollWrapper.style.animation = 'none';
      autoScrollWrapper.style.display = 'flex';
      autoScrollWrapper.style.justifyContent = 'center';
      autoScrollWrapper.style.gap = '1rem';
    }
  }

  // View all chapters toggle
  if (viewMoreLinks.length > 0) {
    viewMoreLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const chaptersContainer = link.closest('.manga-chapters');
        if (chaptersContainer) {
          const allChapters = chaptersContainer.querySelectorAll('.chapter-link');
          
          allChapters.forEach(chapter => {
            if (chapter && chapter.parentElement) {
              chapter.parentElement.style.display = 'block';
            }
          });
          
          if (link.parentElement) {
            link.parentElement.style.display = 'none';
          }
        }
      });
    });
  }

  // Lazy loading for manga pages in reader
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if (lazyImages.length > 0) {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => {
        if (img.dataset.src) {
          imageObserver.observe(img);
        }
      });
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      lazyImages.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    }
  }
});

//scroll
document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.querySelector('.scroll-container');
  if (!scrollContainer) return;

  let isDragging = false;
  let startX, scrollLeft, timeoutId;

  // Bắt đầu kéo
  const startDrag = (e) => {
    isDragging = true;
    scrollContainer.style.scrollBehavior = 'auto'; // Tắt hiệu ứng mượt khi kéo
    startX = (e.pageX || e.touches[0].pageX) - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
    scrollContainer.style.cursor = 'grabbing';
  };

  // Kéo di chuyển
  const drag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = (e.pageX || e.touches[0].pageX) - scrollContainer.offsetLeft;
    const walk = (x - startX) * 1.5; // Tốc độ kéo
    scrollContainer.scrollLeft = scrollLeft - walk;
  };

  // Kết thúc kéo
  const endDrag = () => {
    isDragging = false;
    scrollContainer.style.scrollBehavior = 'smooth'; // Bật lại hiệu ứng mượt
    scrollContainer.style.cursor = 'grab';
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      scrollContainer.style.overflowX = 'auto'; // Hiện thanh cuộn sau khi kéo xong
    }, 500);
  };

  // Sự kiện chuột
  scrollContainer.addEventListener('mousedown', startDrag);
  scrollContainer.addEventListener('mousemove', drag);
  scrollContainer.addEventListener('mouseup', endDrag);
  scrollContainer.addEventListener('mouseleave', endDrag);

  // Sự kiện cảm ứng
  scrollContainer.addEventListener('touchstart', startDrag);
  scrollContainer.addEventListener('touchmove', drag);
  scrollContainer.addEventListener('touchend', endDrag);
});
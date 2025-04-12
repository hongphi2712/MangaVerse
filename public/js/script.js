//  Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
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
      container.addEventListener('wheel', (e) => {
        e.preventDefault(); // Ngăn chặn cuộn dọc trang
        container.scrollLeft += e.deltaY; // Sử dụng deltaY để cuộn ngang
      });
    });
  }
});




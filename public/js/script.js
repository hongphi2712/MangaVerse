document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const searchBar = document.getElementById('searchBar');
  const scrollContainers = document.querySelectorAll('.scroll-container');

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

  // Xử lý auto-scroll và scroll thủ công
  if (scrollContainers.length > 0) {
    scrollContainers.forEach(container => {
      // Đảm bảo container luôn có thể scroll thủ công
      container.style.overflowX = 'auto';
      container.style.scrollBehavior = 'smooth';

      // Tìm các item gốc (không tính duplicate)
      const originalItems = container.querySelectorAll('.card:not(.duplicate)');
      let originalContentWidth = 0;

      if (originalItems.length === 0) {
        console.log('No original items found in container. Auto-scroll will not run.');
        return; // Thoát nếu không có nội dung
      }

      // Tính chiều rộng thực tế của nội dung gốc
      originalItems.forEach(item => {
        const style = getComputedStyle(item);
        const width = item.offsetWidth;
        const marginRight = parseFloat(style.marginRight || 0);
        originalContentWidth += width + marginRight;
      });

      console.log('Original Content Width:', originalContentWidth);
      console.log('Container Parent Width:', container.parentElement.clientWidth);

      // Nếu nội dung không đủ dài để cuộn
      if (originalContentWidth <= container.parentElement.clientWidth) {
        console.log('Content width is less than parent width. Auto-scroll disabled.');
        container.style.animation = 'none'; // Tắt animation nếu không cần cuộn
        return;
      }

      // Áp dụng CSS animation với chiều rộng động
      container.style.setProperty('--scroll-distance', `-${originalContentWidth}px`);
      container.style.setProperty('--scroll-duration', `${originalContentWidth / 50}s`); // Tốc độ dựa trên chiều rộng
      container.style.width = 'max-content'; // Đảm bảo container đủ rộng để chứa nội dung

      // Scroll thủ công (drag/swipe)
      let isDown = false;
      let startX;
      let scrollLeft;

      container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.classList.add('active');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        container.style.animationPlayState = 'paused'; // Dừng animation khi kéo
      });

      container.addEventListener('mouseleave', () => {
        isDown = false;
        container.classList.remove('active');
        container.style.animationPlayState = 'running'; // Tiếp tục animation
      });

      container.addEventListener('mouseup', () => {
        isDown = false;
        container.classList.remove('active');
        container.style.animationPlayState = 'running';
      });

      container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;

        // Seamless looping khi kéo thủ công
        if (container.scrollLeft >= originalContentWidth) {
          container.scrollTo({
            left: 0,
            behavior: 'instant'
          });
          scrollLeft = 0;
          startX = e.pageX - container.offsetLeft;
        } else if (container.scrollLeft <= 0) {
          container.scrollTo({
            left: originalContentWidth,
            behavior: 'instant'
          });
          scrollLeft = originalContentWidth;
          startX = e.pageX - container.offsetLeft;
        }
      });

      // Touch scroll cho mobile
      container.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length > 0) {
          startX = e.touches[0].pageX - container.offsetLeft;
          scrollLeft = container.scrollLeft;
          container.style.animationPlayState = 'paused'; // Dừng animation khi lướt
        }
      });

      container.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches.length > 0) {
          const x = e.touches[0].pageX - container.offsetLeft;
          const walk = (x - startX) * 2;
          container.scrollLeft = scrollLeft - walk;

          // Seamless looping khi lướt trên mobile
          if (container.scrollLeft >= originalContentWidth) {
            container.scrollTo({
              left: 0,
              behavior: 'instant'
            });
            scrollLeft = 0;
            startX = e.touches[0].pageX - container.offsetLeft;
          } else if (container.scrollLeft <= 0) {
            container.scrollTo({
              left: originalContentWidth,
              behavior: 'instant'
            });
            scrollLeft = originalContentWidth;
            startX = e.touches[0].pageX - container.offsetLeft;
          }
        }
      });

      container.addEventListener('touchend', () => {
        container.style.animationPlayState = 'running'; // Tiếp tục animation
      });

      // Wheel/trackpad horizontal scrolling
      container.addEventListener('wheel', (e) => {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
        container.style.animationPlayState = 'paused'; // Dừng animation khi dùng bánh xe

        // Seamless looping khi dùng bánh xe
        if (container.scrollLeft >= originalContentWidth) {
          container.scrollTo({
            left: 0,
            behavior: 'instant'
          });
        } else if (container.scrollLeft <= 0) {
          container.scrollTo({
            left: originalContentWidth,
            behavior: 'instant'
          });
        }

        // Tiếp tục animation sau 2 giây
        clearTimeout(container.scrollTimeout);
        container.scrollTimeout = setTimeout(() => {
          container.style.animationPlayState = 'running';
        }, 2000);
      });
    });
  }
});
document.addEventListener('DOMContentLoaded', function() {
  // Khởi tạo các chức năng chính
  initSidebar();
  initAuthPopups();
  initScrollContainers();
  initLazyLoading();
});

// Thêm hàm mới để xử lý lazy loading
function initLazyLoading() {
  // Kiểm tra nếu trình duyệt hỗ trợ Intersection Observer
  if ('IntersectionObserver' in window) {
    const lazyItems = document.querySelectorAll('.ranking-item-wrapper[loading="lazy"]');
    
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          item.removeAttribute('loading');
          lazyObserver.unobserve(item);
        }
      });
    }, {
      rootMargin: '200px 0px',
      threshold: 0.01
    });
    
    lazyItems.forEach(item => {
      lazyObserver.observe(item);
    });
  }
}

// ===== SIDEBAR FUNCTIONALITY =====
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarClose = document.getElementById('sidebarClose');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  
  if (!sidebarToggle || !sidebar || !sidebarClose || !sidebarOverlay) return;
  
  // Mở sidebar
  sidebarToggle.addEventListener('click', function() {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  // Đóng sidebar
  function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  sidebarClose.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);
  
  // Xuất hàm ra ngoài để các module khác có thể sử dụng
  window.closeSidebar = closeSidebar;
}

// ===== AUTH POPUPS FUNCTIONALITY =====
function initAuthPopups() {
  const loginTrigger = document.querySelector('.sidebar-link.login-trigger');
  const registerTrigger = document.querySelector('.sidebar-link.register-trigger');
  const loginPopup = document.getElementById('loginPopup');
  const registerPopup = document.getElementById('registerPopup');

  if (loginTrigger && loginPopup) {
    loginTrigger.addEventListener('click', function(e) {
      e.preventDefault();
      loginPopup.style.display = 'flex';
      if (window.closeSidebar) window.closeSidebar();
    });
  }

  if (registerTrigger && registerPopup) {
    registerTrigger.addEventListener('click', function(e) {
      e.preventDefault();
      registerPopup.style.display = 'flex';
      if (window.closeSidebar) window.closeSidebar();
    });
  }
}

// ===== SCROLL CONTAINERS FUNCTIONALITY =====
function initScrollContainers() {
  const scrollContainers = document.querySelectorAll('.scroll-container');
  
  if (scrollContainers.length === 0) return;
  
  // Thiết lập biến CSS cho các container
  setupScrollContainerVariables(scrollContainers);
  
  // Khởi tạo các chức năng cho từng container
  scrollContainers.forEach(container => {
    // Thêm nút điều khiển scroll
    addScrollControls(container);
    
    // Xử lý scroll thủ công
    enableDragToScroll(container);
    
    // Kiểm tra và cập nhật trạng thái nút điều khiển
    updateScrollButtonsState(container);
    
    // Theo dõi sự kiện scroll để cập nhật trạng thái nút
    container.addEventListener('scroll', () => {
      updateScrollButtonsState(container);
    });
  });
  
  // Theo dõi thay đổi kích thước màn hình
  window.addEventListener('resize', () => {
    scrollContainers.forEach(container => {
      updateScrollButtonsState(container);
    });
  });
}

// Thiết lập biến CSS cho các container
function setupScrollContainerVariables(containers) {
  containers.forEach(container => {
    const cards = container.querySelectorAll('.card');
    if (cards.length > 0) {
      // Thiết lập biến CSS cho số lượng card
      container.style.setProperty('--card-count', cards.length);
      
      // Tính toán chiều rộng của tất cả card
      let totalWidth = 0;
      cards.forEach(card => {
        const style = window.getComputedStyle(card);
        const width = card.offsetWidth;
        const marginRight = parseFloat(style.marginRight || 0);
        totalWidth += width + marginRight;
      });
      
      // Thiết lập biến CSS cho khoảng cách scroll
      container.style.setProperty('--scroll-distance', `-${totalWidth}px`);
    }
  });
}

// Thêm nút điều khiển scroll
function addScrollControls(container) {
  // Thêm class để điều chỉnh padding
  container.classList.add('with-controls');
  
  // Tạo div chứa nút điều khiển
  const controls = document.createElement('div');
  controls.className = 'scroll-controls';
  
  // Tạo nút prev
  const prevBtn = document.createElement('button');
  prevBtn.className = 'scroll-btn prev';
  prevBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>';
  prevBtn.setAttribute('aria-label', 'Cuộn sang trái');
  
  // Tạo nút next
  const nextBtn = document.createElement('button');
  nextBtn.className = 'scroll-btn next';
  nextBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>';
  nextBtn.setAttribute('aria-label', 'Cuộn sang phải');
  
  // Thêm sự kiện click cho nút prev
  prevBtn.addEventListener('click', () => {
    scrollContainer(container, -0.8);
  });
  
  // Thêm sự kiện click cho nút next
  nextBtn.addEventListener('click', () => {
    scrollContainer(container, 0.8);
  });
  
  // Thêm nút vào controls
  controls.appendChild(prevBtn);
  controls.appendChild(nextBtn);
  
  // Thêm controls vào container
  container.parentNode.insertBefore(controls, container.nextSibling);
  
  // Lưu trữ tham chiếu đến nút để sử dụng sau này
  container.prevBtn = prevBtn;
  container.nextBtn = nextBtn;
}

// Hàm cuộn container
function scrollContainer(container, factor) {
  const scrollAmount = container.clientWidth * Math.abs(factor);
  container.scrollBy({
    left: factor < 0 ? -scrollAmount : scrollAmount,
    behavior: 'smooth'
  });
}

// Cập nhật trạng thái nút điều khiển dựa trên vị trí scroll
function updateScrollButtonsState(container) {
  if (!container.prevBtn || !container.nextBtn) return;
  
  // Kiểm tra xem có thể scroll không
  const canScrollLeft = container.scrollLeft > 0;
  const canScrollRight = container.scrollLeft < container.scrollWidth - container.clientWidth - 5; // Thêm dung sai 5px
  
  // Cập nhật trạng thái nút
  container.prevBtn.classList.toggle('hidden', !canScrollLeft);
  container.nextBtn.classList.toggle('hidden', !canScrollRight);
}

// Cho phép kéo để scroll
function enableDragToScroll(container) {
  let isDown = false;
  let startX;
  let scrollLeft;
  
  // Mouse events
  container.addEventListener('mousedown', handleDragStart);
  container.addEventListener('mouseleave', handleDragEnd);
  container.addEventListener('mouseup', handleDragEnd);
  container.addEventListener('mousemove', handleDragMove);
  
  // Touch events
  container.addEventListener('touchstart', handleTouchStart, { passive: true });
  container.addEventListener('touchend', handleDragEnd, { passive: true });
  container.addEventListener('touchcancel', handleDragEnd, { passive: true });
  container.addEventListener('touchmove', handleTouchMove, { passive: true });
  
  // Wheel event
  container.addEventListener('wheel', handleWheel, { passive: false });
  
  // Xử lý bắt đầu kéo bằng chuột
  function handleDragStart(e) {
    // Chỉ kích hoạt kéo khi không nhấp vào thanh cuộn
    if (e.offsetY < container.clientHeight - 10) { // 10px là khoảng cách an toàn
      isDown = true;
      container.style.cursor = 'grabbing';
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      e.preventDefault(); // Ngăn chặn việc chọn text khi kéo
    }
  }
  
  // Xử lý kết thúc kéo
  function handleDragEnd() {
    isDown = false;
    container.style.cursor = 'grab';
  }
  
  // Xử lý di chuyển chuột khi kéo
  function handleDragMove(e) {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5; // Tốc độ scroll
    container.scrollLeft = scrollLeft - walk;
    updateScrollButtonsState(container);
  }
  
  // Xử lý bắt đầu kéo bằng touch
  function handleTouchStart(e) {
    if (e.touches.length === 1) {
      isDown = true;
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    }
  }
  
  // Xử lý di chuyển touch khi kéo
  function handleTouchMove(e) {
    if (!isDown || e.touches.length !== 1) return;
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollLeft - walk;
    updateScrollButtonsState(container);
  }
  
  // Xử lý wheel event để scroll ngang
  function handleWheel(e) {
    if (e.deltaY !== 0) {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
      updateScrollButtonsState(container);
    }
  }
}
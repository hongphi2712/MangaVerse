document.addEventListener('DOMContentLoaded',  function() {
  // Get elements
  const pages = document.querySelectorAll('.manga-page img');
  const pagesList = Array.from(pages).map(img => img.src);
  const totalPages = pagesList.length;
  
  // Page navigation variables
  let currentPageIndex = 0;
  
  // Reading mode buttons
  const modeButtons = document.querySelectorAll('.mode-btn');
  const verticalReader = document.getElementById('verticalReader');
  const singlePageReader = document.getElementById('singlePageReader');
  
  // Initialize reader
  function initReader() {
    if (pages.length === 0) return;
    
    // Set up reading mode switch
    modeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const mode = this.getAttribute('data-mode');
        
        // Update active button
        modeButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Switch reader mode
        if (mode === 'vertical') {
          verticalReader.style.display = 'flex';
          singlePageReader.style.display = 'none';
        } else {
          verticalReader.style.display = 'none';
          singlePageReader.style.display = 'block';
          
          // Initialize single page viewer if it's the first time
          if (!singlePageReader.initialized) {
            updateSinglePage();
            singlePageReader.initialized = true;
          }
        }
      });
    });
    
    // Set up keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (singlePageReader.style.display === 'block') {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          goToNextPage();
        } else if (e.key === 'ArrowLeft') {
          goToPreviousPage();
        }
      }
    });
  }
  
  // Update single page view
  window.updateSinglePage = function() {
    const pageCounter = document.getElementById('pageCounter');
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const singlePageImage = document.getElementById('singlePageImage');
    
    // Update page counter
    pageCounter.textContent = `Page ${currentPageIndex + 1} / ${totalPages}`;
    
    // Update button states
    prevButton.disabled = currentPageIndex === 0;
    nextButton.disabled = currentPageIndex === totalPages - 1;
    
    // Update image
    document.getElementById('single-loading').style.display = 'flex';
    singlePageImage.src = pagesList[currentPageIndex];
  };
  
  // Go to next page
  window.goToNextPage = function() {
    if (currentPageIndex < totalPages - 1) {
      currentPageIndex++;
      updateSinglePage();
    }
  };
  
  // Go to previous page
  window.goToPreviousPage = function() {
    if (currentPageIndex > 0) {
      currentPageIndex--;
      updateSinglePage();
    }
  };
  
  // Handle image error
  window.handleImageError = function(img, pageNumber) {
    img.parentNode.innerHTML = `
      <div class="error-message">
        <p>Failed to load page ${pageNumber}</p>
        <button onclick="retryLoadImage(this, '${img.src}', ${pageNumber})">Retry</button>
      </div>
    `;
  };
  
  // Retry loading an image
  window.retryLoadImage = function(button, src, pageNumber) {
    const parent = button.parentNode.parentNode;
    parent.innerHTML = `
      <div class="page-loading" id="loading-retry-${pageNumber}">
        <span class="loader"></span>
      </div>
      <img src="${src}" alt="Page ${pageNumber}" loading="lazy"
           onload="document.getElementById('loading-retry-${pageNumber}').style.display = 'none'"
           onerror="handleImageError(this, ${pageNumber})">
    `;
  };
  
  // Handle error in single page mode
  window.handleSingleImageError = function() {
    const singlePageImage = document.getElementById('singlePageImage');
    singlePageImage.style.display = 'none';
    document.getElementById('single-loading').innerHTML = `
      <div class="error-message">
        <p>Failed to load page ${currentPageIndex + 1}</p>
        <button onclick="retrySinglePage()">Retry</button>
      </div>
    `;
  };
  
  // Retry loading in single page mode
  window.retrySinglePage = function() {
    const singlePageImage = document.getElementById('singlePageImage');
    singlePageImage.style.display = 'block';
    document.getElementById('single-loading').innerHTML = '<span class="loader"></span>';
    updateSinglePage();
  };
  
  // Initialize the reader
  initReader();
});
  
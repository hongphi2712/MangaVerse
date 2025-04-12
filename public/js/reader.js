document.addEventListener('DOMContentLoaded', function() {
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
    if (pages.length === 0) {
      console.error('No pages found');
      return;
    }
    
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
          
          // Initialize single page viewer
          updateSinglePage();
        }
      });
    });
    
    // Set up keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (singlePageReader.style.display === 'block') {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          e.preventDefault();
          goToNextPage();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goToPreviousPage();
        }
      }
    });
  }
  
  // Update single page view
  window.updateSinglePage = function() {
    if (totalPages === 0) return;
    
    const pageCounter = document.getElementById('pageCounter');
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const singlePageImage = document.getElementById('singlePageImage');
    const loadingElement = document.getElementById('single-loading');
    
    // Update page counter
    pageCounter.textContent = `Page ${currentPageIndex + 1} / ${totalPages}`;
    
    // Update button states
    prevButton.disabled = currentPageIndex === 0;
    nextButton.disabled = currentPageIndex === totalPages - 1;
    
    // Show loading and hide current image
    loadingElement.style.display = 'flex';
    singlePageImage.style.display = 'none';
    
    // Update image
    singlePageImage.onload = function() {
      loadingElement.style.display = 'none';
      singlePageImage.style.display = 'block';
    };
    singlePageImage.onerror = function() {
      handleSingleImageError();
    };
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
  
  // Handle error in single page mode
  window.handleSingleImageError = function() {
    const singlePageImage = document.getElementById('singlePageImage');
    const loadingElement = document.getElementById('single-loading');
    
    singlePageImage.style.display = 'none';
    loadingElement.innerHTML = `
      <div class="error-message">
        <p>Failed to load page ${currentPageIndex + 1}</p>
        <button onclick="retrySinglePage()">Retry</button>
      </div>
    `;
  };
  
  // Retry loading in single page mode
  window.retrySinglePage = function() {
    const loadingElement = document.getElementById('single-loading');
    loadingElement.innerHTML = '<span class="loader"></span>';
    loadingElement.style.display = 'flex';
    updateSinglePage();
  };
  
  // Initialize the reader
  initReader();
});
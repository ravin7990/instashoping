// Global state to store products
let products = [];
let activeCategory = 'all';
let searchQuery = '';

// DOM Elements
const productGrid = document.getElementById('product-grid');
const categoriesContainer = document.getElementById('categories-container');
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');
const resultsCount = document.getElementById('results-count');
const emptyState = document.getElementById('empty-state');
const resetFiltersBtn = document.getElementById('reset-filters-btn');
const lastUpdatedText = document.getElementById('last-updated-text');
const scrollLeftBtn = document.getElementById('scroll-left-btn');
const scrollRightBtn = document.getElementById('scroll-right-btn');
const shareWebsiteBtn = document.getElementById('share-website-btn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// Modal Elements
const reelModal = document.getElementById('reel-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalBody = document.getElementById('modal-body');

/**
 * Initialize application
 */
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    setupEventListeners();
});

/**
 * Fetch products from products.json
 */
async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        products = await response.json();
        
        // Process data
        sortProducts();
        updateLastUpdated();
        generateCategoryChips();
        renderProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
        productGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #ef4444;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 2.5rem; margin-bottom: 12px;"></i>
                <h3>Failed to load products</h3>
                <p>Please check if products.json is present and valid.</p>
            </div>
        `;
    }
}

/**
 * Sort products according to logic:
 * 1. Pinned products (pinned: true) always appear first.
 * 2. Among pinned, sort by dateAdded descending (newest first).
 * 3. Non-pinned follow, sorted by dateAdded descending (newest first).
 */
function sortProducts() {
    products.sort((a, b) => {
        // First sort by pinned status
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        
        // If pinned status is the same, sort by dateAdded descending
        const dateA = new Date(a.dateAdded);
        const dateB = new Date(b.dateAdded);
        return dateB - dateA;
    });
}

/**
 * Calculate and display the last updated timestamp
 * using the most recent dateAdded in the dataset.
 */
function updateLastUpdated() {
    if (products.length === 0) return;
    
    // Find the latest date
    const dates = products.map(p => new Date(p.dateAdded));
    const latestDate = new Date(Math.max(...dates));
    
    // Format: "July 15, 2026"
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = latestDate.toLocaleDateString('en-US', options);
    
    lastUpdatedText.innerHTML = `<i class="fa-regular fa-calendar-check"></i> Last Updated: ${formattedDate}`;
}

/**
 * Dynamically generate category buttons/chips based on categories in products.json
 */
function generateCategoryChips() {
    // Get unique categories
    const categories = ['all', ...new Set(products.map(p => p.category))];
    
    // Build buttons
    categoriesContainer.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `category-chip ${cat === activeCategory ? 'active' : ''}`;
        btn.textContent = cat === 'all' ? 'All Items' : cat;
        btn.setAttribute('data-category', cat);
        
        btn.addEventListener('click', () => {
            // Update active state
            document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            
            activeCategory = cat;
            renderProducts();
            
            // Scroll chip to view if overflowed
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
        
        categoriesContainer.appendChild(btn);
    });
}

/**
 * Check if a date is within the last 7 days
 * @param {string} dateString - ISO Date String
 * @returns {boolean}
 */
function isNewProduct(dateString) {
    const addedDate = new Date(dateString);
    const currentDate = new Date();
    
    // Reset hours to compare calendar days
    addedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(currentDate - addedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 7;
}

/**
 * Render products in the grid based on search query and category filters
 */
function renderProducts() {
    // Clear grid
    productGrid.innerHTML = '';
    
    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === 'all' || product.category.toLowerCase() === activeCategory.toLowerCase();
        
        const titleMatch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
        const descMatch = product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSearch = titleMatch || descMatch;
        
        return matchesCategory && matchesSearch;
    });
    
    // Update counter
    resultsCount.textContent = `Showing ${filteredProducts.length} product${filteredProducts.length === 1 ? '' : 's'}`;
    
    // Toggle Empty State
    if (filteredProducts.length === 0) {
        emptyState.style.display = 'block';
        productGrid.style.display = 'none';
        return;
    } else {
        emptyState.style.display = 'none';
        productGrid.style.display = 'grid';
    }
    
    // Render Cards
    filteredProducts.forEach(product => {
        const isNew = isNewProduct(product.dateAdded);
        const card = document.createElement('div');
        card.className = `product-card`;
        card.id = `product-${product.id}`;
        
        // Build badges
        let badgesHtml = '';
        if (product.pinned) {
            badgesHtml += `<span class="badge badge-pinned"><i class="fa-solid fa-thumbtack"></i> Pinned</span>`;
        }
        if (isNew) {
            badgesHtml += `<span class="badge badge-new"><i class="fa-solid fa-sparkles"></i> New</span>`;
        }
        
        card.innerHTML = `
            <div class="product-img-wrapper">
                <div class="badge-container">
                    ${badgesHtml}
                </div>
                <button class="product-share-btn" data-id="${product.id}" aria-label="Share product">
                    <i class="fa-solid fa-share-nodes"></i>
                </button>
                <img src="${product.image}" alt="${product.title}" class="product-img" loading="lazy" onerror="this.src='https://placehold.co/400x400/1e293b/cbd5e1?text=No+Image'">
                ${product.instagramEmbed ? `
                <div class="reel-overlay" data-id="${product.id}">
                    <span class="reel-play-btn"><i class="fa-solid fa-play"></i> Watch Reel</span>
                </div>
                ` : ''}
            </div>
            <div class="product-details">
                <span class="product-category">${product.category}</span>
                <h2 class="product-title" title="${product.title}">${product.title}</h2>
                <p class="product-description" title="${product.description}">${product.description}</p>
                <div class="product-footer-meta">
                    <div class="product-price-row">
                        <span class="price-label">Price:</span>
                        <span class="product-price">${product.price}</span>
                    </div>
                    <div class="product-actions" style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
                        <a href="${product.amazonLink}" target="_blank" rel="noopener noreferrer" class="btn btn-amazon">
                            <i class="fa-brands fa-amazon"></i> Buy on Amazon <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.75rem; margin-left: 2px;"></i>
                        </a>
                        ${product.instagramEmbed ? `
                        <button class="btn btn-instagram-outline btn-watch-reel" data-id="${product.id}">
                            <i class="fa-brands fa-instagram"></i> Watch Reel
                        </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        productGrid.appendChild(card);
    });
    
    // Re-attach share button event listeners
    document.querySelectorAll('.product-share-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const prodId = btn.getAttribute('data-id');
            const product = products.find(p => p.id === prodId);
            if (product) {
                copyToClipboard(product.amazonLink, `Amazon link copied for "${product.title}"!`);
            }
        });
    });

    // Attach Watch Reel event listeners
    document.querySelectorAll('.btn-watch-reel, .reel-overlay').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const prodId = el.getAttribute('data-id');
            openReelModal(prodId);
        });
    });
}

/**
 * Copy string content to clipboard and show toast
 */
function copyToClipboard(text, message) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(message || 'Link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast(message || 'Link copied to clipboard!');
        } catch (e) {
            showToast('Unable to copy. Please manually copy the link.');
        }
        document.body.removeChild(textarea);
    });
}

/**
 * Display toast notification
 */
function showToast(message) {
    toastMessage.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Configure search, category click, and sharing event listeners
 */
function setupEventListeners() {
    // Search input typing
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        
        // Show/hide clear search button
        if (searchQuery.length > 0) {
            clearSearchBtn.style.display = 'flex';
        } else {
            clearSearchBtn.style.display = 'none';
        }
        
        renderProducts();
    });
    
    // Clear search button
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.style.display = 'none';
        renderProducts();
        searchInput.focus();
    });
    
    // Reset filters empty state button
    resetFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.style.display = 'none';
        
        activeCategory = 'all';
        const allChip = document.querySelector('.category-chip[data-category="all"]');
        if (allChip) {
            document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
            allChip.classList.add('active');
        }
        
        renderProducts();
    });
    
    // Share website button
    shareWebsiteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const pageUrl = window.location.href;
        copyToClipboard(pageUrl, 'Store link copied to clipboard!');
    });
    
    // Desktop Category Scrolling Arrows
    scrollLeftBtn.addEventListener('click', () => {
        categoriesContainer.scrollBy({ left: -200, behavior: 'smooth' });
    });
    
    scrollRightBtn.addEventListener('click', () => {
        categoriesContainer.scrollBy({ left: 200, behavior: 'smooth' });
    });

    // Check scroll state to show/hide category arrows
    const toggleScrollArrows = () => {
        const { scrollLeft, scrollWidth, clientWidth } = categoriesContainer;
        scrollLeftBtn.style.opacity = scrollLeft > 10 ? '1' : '0';
        scrollLeftBtn.style.pointerEvents = scrollLeft > 10 ? 'auto' : 'none';
        
        // Allow tiny tolerance for floating point rounding in scrollWidth
        scrollRightBtn.style.opacity = (scrollWidth - clientWidth - scrollLeft) > 10 ? '1' : '0';
        scrollRightBtn.style.pointerEvents = (scrollWidth - clientWidth - scrollLeft) > 10 ? 'auto' : 'none';
    };
    
    categoriesContainer.addEventListener('scroll', toggleScrollArrows);
    window.addEventListener('resize', toggleScrollArrows);
    
    // Initial check (delay slightly to ensure rendering complete)
    setTimeout(toggleScrollArrows, 500);

    // Close modal event listeners
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeReelModal);
    }
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeReelModal);
    }
    // Close modal on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && reelModal && reelModal.classList.contains('active')) {
            closeReelModal();
        }
    });
}

/**
 * Open Instagram Reel modal
 */
function openReelModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.instagramEmbed) return;

    // Inject embed code
    modalBody.innerHTML = product.instagramEmbed;
    
    // Show modal
    reelModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    // Process embed dynamically if SDK is loaded
    if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
    }
}

/**
 * Close Instagram Reel modal
 */
function closeReelModal() {
    reelModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
    // Clear body after animation to stop video/audio playing in background
    setTimeout(() => {
        modalBody.innerHTML = '';
    }, 300);
}

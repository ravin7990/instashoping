// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelector('.nav-links');
const loadingMessage = document.getElementById('loadingMessage');

// Global products array
let products = [];

// Load products from JSON file
// ... (other code)

// Load products from JSON file
async function loadProducts() {
    try {
        loadingMessage.style.display = 'block';
        const response = await fetch('products.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if the data has the products array
        if (data.products && Array.isArray(data.products)) {
            products = data.products;
            displayProducts(products);
        } else {
            throw new Error('Invalid JSON structure: expected an object with a "products" array');
        }
        
        loadingMessage.style.display = 'none';
    } catch (error) {
        console.error('Error loading products:', error);
        loadingMessage.innerHTML = `Error loading products: ${error.message}. Please refresh the page.`;
    }
}

// ... (rest of the code)

// Display products
function displayProducts(productsToShow) {
    productsGrid.innerHTML = '';
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">No products found matching your criteria.</p>';
        return;
    }
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-category', product.category);
        
        productCard.innerHTML = `
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price}</div>
                <a href="${product.affiliateLink}" target="_blank" class="buy-btn">Buy Now</a>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
        
        // Add fade-in animation
        setTimeout(() => {
            productCard.classList.add('visible');
        }, 100);
    });
}

// Filter products by category
function filterProducts(category) {
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        displayProducts(filteredProducts);
    }
}

// Search products
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) || 
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    displayProducts(filteredProducts);
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

// Check for saved theme preference
function checkThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

// Event Listeners
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        // Filter products
        filterProducts(btn.getAttribute('data-filter'));
    });
});

searchInput.addEventListener('input', () => {
    searchProducts(searchInput.value);
});

themeToggle.addEventListener('click', toggleDarkMode);

mobileMenu.addEventListener('click', toggleMobileMenu);

// Contact form submission
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! I\'ll get back to you soon.');
    this.reset();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    checkThemePreference();
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        });
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navLinks.style.display = 'flex';
    } else {
        navLinks.style.display = 'none';
    }

});

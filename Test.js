// Mobile Menu Toggle Functionality
document.addEventListener('DOMContentLoaded', function () {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');

    if (hamburgerMenu && mainNav) {
        hamburgerMenu.addEventListener('click', function () {
            // Toggle active class on hamburger menu
            hamburgerMenu.classList.toggle('active');

            // Toggle active class on navigation
            mainNav.classList.toggle('active');
        });

        // Close menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                hamburgerMenu.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            if (!hamburgerMenu.contains(event.target) && !mainNav.contains(event.target)) {
                hamburgerMenu.classList.remove('active');
                mainNav.classList.remove('active');
            }
        });
    }

    // Update cart count on page load
    updateCartCount();

    // Initialize theme
    initializeTheme();

    // Initialize search
    initializeSearch();
});

// Cart functionality
function addToCart(id, title, instructor, price, image, students, duration) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if item already exists
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            title: title,
            instructor: instructor,
            price: price,
            image: image,
            students: students,
            duration: duration,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Show success message
    showNotification('Formation ajoutée au panier !', 'success');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#007bff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== THEME FUNCTIONALITY =====
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    if (!themeToggle || !themeIcon) return;

    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Update icon based on current theme
    updateThemeIcon(savedTheme);

    // Add click event listener
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Update theme
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update icon
    updateThemeIcon(newTheme);

    // Theme switched silently
}

function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('theme-icon');
    if (!themeIcon) return;

    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// ===== SEARCH FUNCTIONALITY =====
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (!searchInput || !searchBtn) return;

    // Sample courses data for search
    const courses = [
        {
            id: '1',
            title: 'Développement Web Full Stack',
            instructor: 'Jean Dupont',
            price: '599€',
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop',
            students: '1234',
            duration: '12 semaines',
            category: 'Développement'
        },
        {
            id: '2',
            title: 'Data Science & IA',
            instructor: 'Sophie Martin',
            price: '799€',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
            students: '856',
            duration: '16 semaines',
            category: 'Data Science'
        },
        {
            id: '3',
            title: 'UX/UI Design Master Class',
            instructor: 'Marie Claire',
            price: '499€',
            image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=250&fit=crop',
            students: '892',
            duration: '10 semaines',
            category: 'Design'
        },
        {
            id: '4',
            title: 'Marketing Digital',
            instructor: 'Pierre Dubois',
            price: '399€',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
            students: '567',
            duration: '8 semaines',
            category: 'Marketing'
        },
        {
            id: '5',
            title: 'Cybersécurité',
            instructor: 'Alexandre Moreau',
            price: '699€',
            image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop',
            students: '423',
            duration: '14 semaines',
            category: 'Sécurité'
        }
    ];

    let searchTimeout;

    // Search input event listener
    searchInput.addEventListener('input', function () {
        clearTimeout(searchTimeout);
        const query = this.value.trim();

        if (query.length < 2) {
            hideSearchResults();
            return;
        }

        searchTimeout = setTimeout(() => {
            performSearch(query, courses);
        }, 300);
    });

    // Search button event listener
    searchBtn.addEventListener('click', function () {
        const query = searchInput.value.trim();
        if (query.length >= 2) {
            performSearch(query, courses);
        }
    });

    // Hide results when clicking outside
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.search-container')) {
            hideSearchResults();
        }
    });
}

function performSearch(query, courses) {
    const searchResults = courses.filter(course =>
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.instructor.toLowerCase().includes(query.toLowerCase()) ||
        course.category.toLowerCase().includes(query.toLowerCase())
    );

    displaySearchResults(searchResults, query);
}

function displaySearchResults(results, query) {
    const searchContainer = document.querySelector('.search-container');
    let resultsDiv = document.querySelector('.search-results');

    if (!resultsDiv) {
        resultsDiv = document.createElement('div');
        resultsDiv.className = 'search-results';
        searchContainer.appendChild(resultsDiv);
    }

    if (results.length === 0) {
        resultsDiv.innerHTML = `
            <div class="no-results">
                Aucune formation trouvée pour "${query}"
            </div>
        `;
    } else {
        resultsDiv.innerHTML = results.map(course => `
            <div class="search-result-item" onclick="selectCourse('${course.id}')">
                <div class="search-result-title">${course.title}</div>
                <div class="search-result-instructor">${course.instructor}</div>
                <div class="search-result-price">${course.price}</div>
            </div>
        `).join('');
    }

    resultsDiv.style.display = 'block';
}

function hideSearchResults() {
    const resultsDiv = document.querySelector('.search-results');
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
}

function selectCourse(courseId) {
    // Hide search results
    hideSearchResults();

    // Clear search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }

    // Scroll to courses section if on index page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        const coursesSection = document.querySelector('.courses-section');
        if (coursesSection) {
            coursesSection.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        // Redirect to index page with course highlight
        window.location.href = 'index.html';
    }

    // Show notification
    showNotification('Formation trouvée !', 'success');
}

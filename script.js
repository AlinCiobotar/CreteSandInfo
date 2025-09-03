// Load partners data from JSON file
let businesses = [];

// Load partners data on page load
async function loadPartnersData() {
    try {
        const response = await fetch('partners_data.json');
        const partnersData = await response.json();
        
        // Convert partners data to business format
        businesses = partnersData.map(partner => ({
            id: parseInt(partner.id),
            name: partner.name,
            category: partner.category,
            location: partner.location || 'Crete',
            description: partner.description,
            image: getPartnerImage(partner),
            contact: partner.contact,
            phone: partner.phone,
            email: partner.email,
            website: partner.website,
            airbnb: partner.airbnb
        }));
        
        console.log('Partners data loaded successfully:', businesses.length, 'partners');
        
        // Check for search parameters in URL and perform search if found
        checkUrlForSearch();
    } catch (error) {
        console.error('Error loading partners data:', error);
        // Fallback to sample data if JSON loading fails
        businesses = getSampleBusinesses();
    }
}

// Check URL for search parameters and perform search if found
function checkUrlForSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = searchQuery;
            performSearch();
        }
    }
}

// Update URL with search parameters
function updateUrlWithSearch(query) {
    const url = new URL(window.location);
    if (query && query.trim()) {
        url.searchParams.set('search', query.trim());
    } else {
        url.searchParams.delete('search');
    }
    window.history.pushState({}, '', url);
}

// Copy current search results link to clipboard
function copySearchLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            showCopySuccessMessage();
        }).catch(err => {
            console.error('Failed to copy link: ', err);
            // Fallback for older browsers
            fallbackCopyTextToClipboard(currentUrl);
        });
    } else {
        alert('No search results to share. Please perform a search first.');
    }
}

// Fallback copy function for older browsers
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccessMessage();
        } else {
            alert('Failed to copy link. Please copy manually: ' + text);
        }
    } catch (err) {
        alert('Failed to copy link. Please copy manually: ' + text);
    }
    
    document.body.removeChild(textArea);
}

// Show success message when link is copied
function showCopySuccessMessage() {
    // Create or update success message
    let successMsg = document.getElementById('copySuccessMessage');
    if (!successMsg) {
        successMsg = document.createElement('div');
        successMsg.id = 'copySuccessMessage';
        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            z-index: 1000;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(successMsg);
    }
    
    successMsg.innerHTML = '<i class="fas fa-check"></i> Link copied to clipboard!';
    successMsg.style.opacity = '1';
    
    // Hide message after 3 seconds
    setTimeout(() => {
        successMsg.style.opacity = '0';
    }, 3000);
}

// Get appropriate image for partner
function getPartnerImage(partner) {
    // Map partner names to their image folders
    const partnerImageMap = {
        'The Greek Cook Out': 'greek-cook-out',
        'Taverna Akrogiali': 'taverna-akrogiali', 
        'Sunset Taverna': 'sunset-taverna',
        'Allar Dinner Show': 'allar-dinner-show',
        'Bellot': 'bellot',
        'Poliou House': 'poliou-house',
        'Lovely Seaside Studio': 'lovely-seaside-studio',
        'Sea Aura Apartment': 'sea-aura-apartment',
        'Villa Dio Petres': 'villa-dio-petres',
        'Villa Jasmin & Olives': 'villa-jasmin-olives',
        'Villa Zax': 'villa-zax',
        'Casa George': 'casa-george',
        'Sougia Taxi & Minivan Services Vittorakis': 'sougia-taxi',
        'Cretan Family Taxi': 'cretan-family-taxi',
        'My Crete Transfer': 'my-crete-transfer',
        'Crete Taxi Driver': 'crete-taxi-driver',
        'Liv Tours and Transfer Chania': 'liv-tours-transfer',
        'Heraklio Taxi': 'heraklio-taxi',
        'Malia Cruises': 'malia-cruises',
        'Sailing South Crete': 'sailing-south-crete',
        'Vintage Sailings': 'vintage-sailings',
        'Fantasia Yachting': 'fantasia-yachting',
        'Balos Paradise Cruises': 'balos-paradise-cruises',
        'Jet Boat Adventures': 'jet-boat-adventures',
        'Vittorakis Travel': 'vittorakis-travel',
        'Excursions in Crete': 'excursions-crete',
        'Wanderlust Tour Chania': 'wanderlust-chania',
        'IMable Travel': 'imable-travel',
        'Chania Sea Experience': 'chania-sea-experience',
        'Cretan Sailing Cruises': 'cretan-sailing-cruises',
        'Alina Rent A Car': 'alina-rent-car',
        'Compass Crete': 'compass-crete',
        'Hermes Rental': 'hermes-rental',
        'Rent from Locals': 'rent-from-locals',
        'Mustang Crete Rent a Car': 'mustang-crete',
        'Gia Panta Kalokairi Rent a Car': 'gia-panta-kalokairi',
        'Fast and Easy Rent a Car': 'fast-easy-rent',
        'Citycar Rent A Car': 'citycar-rent',
        'Chania Car Rental': 'chania-car-rental',
        'Heraklion Express Taxi': 'heraklion-express-taxi',
        'Blue Sea Apartments': 'blue-sea-apartments',
        'Heraklion Premium Cars': 'heraklion-premium-cars',
        'Chania Boat Tours': 'chania-boat-tours',
        'Mountain Adventures Crete': 'mountain-adventures-crete',
        'Aroma Kritis': 'aroma-kritis'
    };
    
    // Check if we have specific images for this partner
    const imageFolder = partnerImageMap[partner.name];
    if (imageFolder) {
        // Use the config function to get the image URL
        return getImageUrl(imageFolder, 'image-1.jpg');
    }
    
    // Fallback to default images by category
    const defaultImages = {
        'accommodations': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'restaurants': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'taxi': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'boats': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'excursions': 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'rent-car': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'shops': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'weddings': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    };
    
    return defaultImages[partner.category] || defaultImages['accommodations'];
}

// Fallback sample data
function getSampleBusinesses() {
    return [
        {
            id: 1,
            name: "Taverna El Greco",
            category: "restaurants",
            location: "Heraklion",
            description: "Authentic Greek cuisine with sea view",
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 2,
            name: "Heraklion Taxi Service",
            category: "taxi",
            location: "Heraklion",
            description: "Reliable 24/7 taxi service",
            image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        }
    ];
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Advanced Search functionality
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Categories and locations mapping
const categoryKeywords = {
    'restaurant': 'restaurants',
    'restaurants': 'restaurants',
    'taverna': 'restaurants',
    'tavernas': 'restaurants',
    'food': 'restaurants',
    'eat': 'restaurants',
    'dining': 'restaurants',
    
    'taxi': 'taxi',
    'taxis': 'taxi',
    'transport': 'taxi',
    'transportation': 'taxi',
    'transfer': 'taxi',
    'transfers': 'taxi',
    
    'boat': 'boats',
    'boats': 'boats',
    'cruise': 'boats',
    'cruises': 'boats',
    'sailing': 'boats',
    'yacht': 'boats',
    'yachts': 'boats',
    
    'excursion': 'excursions',
    'excursions': 'excursions',
    'tour': 'excursions',
    'tours': 'excursions',
    'trip': 'excursions',
    'trips': 'excursions',
    'adventure': 'excursions',
    'hiking': 'excursions',
    
    'car': 'rent-car',
    'cars': 'rent-car',
    'rent': 'rent-car',
    'rental': 'rent-car',
    'rentals': 'rent-car',
    'rent car': 'rent-car',
    'rent a car': 'rent-car',
    'car rental': 'rent-car',
    'car rentals': 'rent-car',
    
    'accommodation': 'accommodations',
    'accommodations': 'accommodations',
    'hotel': 'accommodations',
    'hotels': 'accommodations',
    'apartment': 'accommodations',
    'apartments': 'accommodations',
    'room': 'accommodations',
    'rooms': 'accommodations',
    'stay': 'accommodations',
    'studio': 'accommodations',
    'studios': 'accommodations',
    'airbnb': 'accommodations',
    
    'wedding': 'weddings',
    'weddings': 'weddings',
    'marriage': 'weddings',
    
    'shop': 'shops',
    'shops': 'shops',
    'store': 'shops',
    'stores': 'shops',
    'shopping': 'shops'
};

// Common location variations
const locationVariations = {
    'chania': ['chania', 'hania', 'xania'],
    'heraklion': ['heraklion', 'iraklion', 'heraklio', 'crete airport', 'ammoudara'],
    'rethymno': ['rethymno', 'rethimno', 'rethymnon'],
    'agios nikolaos': ['agios nikolaos', 'ag nikolaos', 'aghios nikolaos'],
    'kissamos': ['kissamos', 'kastelli', 'kasteli'],
    'sougia': ['sougia', 'soughia'],
    'malia': ['malia', 'mallia'],
    'agia pelagia': ['agia pelagia', 'ag pelagia', 'aghia pelagia'],
    'ammoudara': ['ammoudara', 'heraklion'],
    'papaderou': ['papaderou', 'sougia']
};

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Add real-time search suggestions
searchInput.addEventListener('input', showSearchSuggestions);

function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return;

    const results = smartSearch(query);
    displaySearchResults(results, query);
    updateUrlWithSearch(query); // Update URL after search
}

function smartSearch(query) {
    const words = query.split(' ').filter(word => word.length > 0);
    let categoryFilter = null;
    let locationFilter = null;
    let searchTerms = [];

    // Special case: if query is "crete" or contains "crete", return all businesses
    if (query.toLowerCase().includes('crete')) {
        return businesses;
    }

    // Parse the query to identify category and location
    words.forEach(word => {
        // Check if word is a category
        const category = categoryKeywords[word];
        if (category) {
            categoryFilter = category;
        } else {
            // Check if word is a location
            let isLocation = false;
            for (const [location, variations] of Object.entries(locationVariations)) {
                if (variations.includes(word)) {
                    locationFilter = location;
                    isLocation = true;
                    break;
                }
            }
            // If not a recognized location, add to search terms
            if (!isLocation) {
                searchTerms.push(word);
            }
        }
    });

    // Filter businesses based on identified criteria
    let results = businesses.filter(business => {
        let matches = true;

        // Category filter
        if (categoryFilter && business.category !== categoryFilter) {
            matches = false;
        }

        // Location filter - more flexible matching
        if (locationFilter) {
            const businessLocation = business.location.toLowerCase();
            const locationVariants = locationVariations[locationFilter] || [locationFilter];
            
            let locationMatches = false;
            
            // Try exact matches first
            locationMatches = locationVariants.some(variant => 
                businessLocation.includes(variant.toLowerCase())
            );
            
            // If no match, try reverse lookup (check if any location contains the search term)
            if (!locationMatches) {
                locationMatches = businessLocation.includes(locationFilter.toLowerCase());
            }
            
            // Also check if search location is contained in business location
            if (!locationMatches) {
                for (const [mainLocation, variants] of Object.entries(locationVariations)) {
                    if (variants.includes(locationFilter)) {
                        locationMatches = businessLocation.includes(mainLocation.toLowerCase());
                        if (locationMatches) break;
                    }
                }
            }
            
            if (!locationMatches) {
                matches = false;
            }
        }

        // Text search in remaining terms
        if (searchTerms.length > 0) {
            const searchText = `${business.name} ${business.description}`.toLowerCase();
            const textMatches = searchTerms.some(term => searchText.includes(term));
            if (!textMatches) {
                matches = false;
            }
        }

        return matches;
    });

    // If no specific filters found, do general search
    if (!categoryFilter && !locationFilter && searchTerms.length === 0) {
        const generalQuery = query.toLowerCase();
        results = businesses.filter(business => {
            const searchText = `${business.name} ${business.category} ${business.location} ${business.description}`.toLowerCase();
            return searchText.includes(generalQuery);
        });
    }

    return results;
}

function showSearchSuggestions() {
    // This could be expanded to show live suggestions
    // For now, we'll keep it simple
}

function displaySearchResults(results, query) {
    const resultsSection = document.getElementById('searchResults');
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsGrid = document.getElementById('resultsGrid');

    // Analyze query to show what was searched
    const words = query.toLowerCase().split(' ').filter(word => word.length > 0);
    let detectedCategory = null;
    let detectedLocation = null;
    
    words.forEach(word => {
        if (categoryKeywords[word]) {
            detectedCategory = categoryKeywords[word];
        }
        for (const [location, variations] of Object.entries(locationVariations)) {
            if (variations.includes(word)) {
                detectedLocation = location;
                break;
            }
        }
    });

    // Create descriptive title
    let titleText = `Search Results for "${query}"`;
    
    // Special case for "Crete" search
    if (query.toLowerCase().includes('crete')) {
        titleText = `All Partners in Crete (${results.length} found)`;
    } else if (detectedCategory && detectedLocation) {
        const categoryName = getCategoryDisplayName(detectedCategory);
        const locationName = detectedLocation.charAt(0).toUpperCase() + detectedLocation.slice(1);
        titleText = `${categoryName} in ${locationName} (${results.length} found)`;
    } else if (detectedCategory) {
        const categoryName = getCategoryDisplayName(detectedCategory);
        titleText = `All ${categoryName} (${results.length} found)`;
    } else if (detectedLocation) {
        const locationName = detectedLocation.charAt(0).toUpperCase() + detectedLocation.slice(1);
        titleText = `All services in ${locationName} (${results.length} found)`;
    } else {
        titleText = `Search Results for "${query}" (${results.length} found)`;
    }
    
    // Create title with copy link button
    resultsTitle.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
            <span>${titleText}</span>
            <button onclick="copySearchLink()" style="
                background: #3498db;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: background 0.3s ease;
            " onmouseover="this.style.background='#2980b9'" onmouseout="this.style.background='#3498db'">
                <i class="fas fa-link"></i>
                Copy Link
            </button>
        </div>
    `;
    
    if (results.length === 0) {
        let noResultsMessage = 'No results found.';
        
        // Special case for "Crete" search
        if (query.toLowerCase().includes('crete')) {
            noResultsMessage = 'No partners found in Crete yet. New partners will be added soon!';
        } else if (detectedCategory && detectedLocation) {
            const categoryName = getCategoryDisplayName(detectedCategory);
            const locationName = detectedLocation.charAt(0).toUpperCase() + detectedLocation.slice(1);
            noResultsMessage = `No ${categoryName.toLowerCase()} found in ${locationName}. New partners will be added soon!`;
        } else if (detectedCategory) {
            const categoryName = getCategoryDisplayName(detectedCategory);
            noResultsMessage = `No ${categoryName.toLowerCase()} found yet. New partners in this category will be added soon!`;
        }
        
        resultsGrid.innerHTML = `
            <div style="text-align: center; grid-column: 1/-1; padding: 40px 20px;">
                <i class="fas fa-search" style="font-size: 48px; color: #bdc3c7; margin-bottom: 20px;"></i>
                <p style="color: #7f8c8d; font-size: 18px; margin-bottom: 10px;">${noResultsMessage}</p>
                <p style="color: #95a5a6; font-size: 14px;">Try searching for a different location or category.</p>
            </div>
        `;
    } else {
        resultsGrid.innerHTML = results.map(business => `
            <div class="business-card" onclick="viewPartnerDetails('${business.id}')">
                <div class="business-image">
                    <img src="${business.image}" alt="${business.name}">
                </div>
                <div class="business-content">
                    <h3>${business.name}</h3>
                    <div class="business-category">
                        <i class="fas fa-${getCategoryIcon(business.category)}"></i>
                        ${getCategoryDisplayName(business.category)}
                    </div>
                    <p>${business.description}</p>
                    <div class="business-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${business.location}
                    </div>
                    <div class="business-contact">
                        ${business.phone ? `<span><i class="fas fa-phone"></i> ${business.phone}</span>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Hide other sections and show results
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.categories').style.display = 'none';
    document.querySelector('.about').style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
    resultsSection.style.display = 'block';
}

function getCategoryDisplayName(category) {
    const displayNames = {
        'restaurants': 'Restaurants',
        'accommodations': 'Accommodations',
        'taxi': 'Taxi Services',
        'boats': 'Boat Services',
        'excursions': 'Excursions',
        'rent-car': 'Car Rentals',
        'weddings': 'Cretan Groups',
        'shops': 'Shops'
    };
    return displayNames[category] || category;
}

function getCategoryIcon(category) {
    const icons = {
        'restaurants': 'utensils',
        'accommodations': 'bed',
        'taxi': 'taxi',
        'boats': 'ship',
        'excursions': 'mountain',
        'rent-car': 'car',
        'weddings': 'users',
        'shops': 'shopping-bag'
    };
    return icons[category] || 'store';
}

// Update the viewPartnerDetails function to work with the search results
function viewPartnerDetails(partnerId) {
    window.location.href = `partner-details.html?id=${partnerId}`;
}

function hideSearchResults() {
    document.getElementById('searchResults').style.display = 'none';
    document.querySelector('.hero').style.display = 'flex';
    document.querySelector('.categories').style.display = 'block';
    document.querySelector('.about').style.display = 'block';
    document.querySelector('.footer').style.display = 'block';
    searchInput.value = '';
    
    // Clear URL parameters when going back
    updateUrlWithSearch('');
}

// Category functionality
function showCategory(category) {
    const categoryResults = businesses.filter(business => business.category === category);
    const categorySection = document.getElementById('categoryResults');
    const categoryTitle = document.getElementById('categoryTitle');
    const categoryGrid = document.getElementById('categoryGrid');

    const categoryNames = {
        'restaurants': 'Restaurants',
        'weddings': 'Cretan Groups',
        'shops': 'Shops',
        'taxi': 'Taxi Services',
        'boats': 'Boat Services',
        'excursions': 'Excursions',
        'rent-car': 'Car Rentals'
    };

    categoryTitle.textContent = categoryNames[category] || category;
    
    categoryGrid.innerHTML = categoryResults.map(business => `
        <div class="business-card" onclick="showBusinessDetails(${business.id})">
            <div class="business-image">
                <img src="${business.image}" alt="${business.name}">
            </div>
            <div class="business-content">
                <h3>${business.name}</h3>
                <p>${business.description}</p>
                <div class="business-location">📍 ${business.location}</div>
            </div>
        </div>
    `).join('');

    // Hide other sections and show category results
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.categories').style.display = 'none';
    document.querySelector('.about').style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
    categorySection.style.display = 'block';
}

function hideCategoryResults() {
    document.getElementById('categoryResults').style.display = 'none';
    document.querySelector('.hero').style.display = 'flex';
    document.querySelector('.categories').style.display = 'block';
    document.querySelector('.about').style.display = 'block';
    document.querySelector('.footer').style.display = 'block';
}

function showBusinessDetails(businessId) {
    const business = businesses.find(b => b.id === businessId);
    if (business) {
        let contactInfo = '';
        if (business.contact) contactInfo += `\nContact: ${business.contact}`;
        if (business.phone) contactInfo += `\nPhone: ${business.phone}`;
        if (business.email) contactInfo += `\nEmail: ${business.email}`;
        if (business.website) contactInfo += `\nWebsite: ${business.website}`;
        if (business.airbnb) contactInfo += `\nAirbnb: ${business.airbnb}`;
        
        alert(`Business Details:\n\nName: ${business.name}\nCategory: ${business.category}\nLocation: ${business.location}\nDescription: ${business.description}${contactInfo}\n\n--- Crete Info Partner ---`);
    }
}

// Add loading animation to category cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe category cards for animation
document.querySelectorAll('.category-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Button hover effects
document.querySelectorAll('.cta-button, .explore-btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Add parallax effect to hero image
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        const rate = scrolled * -0.5;
        heroImage.style.transform = `translateY(${rate}px) scale(1.05)`;
    }
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    // Load partners data first
    loadPartnersData();
    
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});

// Add counter animation for statistics (if you want to add them later)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    updateCounter();
}

// Add scroll-triggered animations
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, {
    threshold: 0.1
});

// Observe elements for scroll animations
document.querySelectorAll('.activity-card, .about-content, .footer-section').forEach(el => {
    scrollObserver.observe(el);
});

// Add form validation (if you add contact forms later)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            input.style.borderColor = '#27ae60';
        }
    });
    
    return isValid;
}

// Add search functionality (if needed)
function searchActivities(query) {
    const activities = document.querySelectorAll('.activity-card');
    activities.forEach(activity => {
        const title = activity.querySelector('h3').textContent.toLowerCase();
        const description = activity.querySelector('p').textContent.toLowerCase();
        const searchTerm = query.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            activity.style.display = 'block';
        } else {
            activity.style.display = 'none';
        }
    });
}

// Add lazy loading for images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

// Observe images for lazy loading
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Add back to top button
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopButton.className = 'back-to-top';
backToTopButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #3498db;
    color: white;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

document.body.appendChild(backToTopButton);

// Show/hide back to top button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.style.opacity = '1';
    } else {
        backToTopButton.style.opacity = '0';
    }
});

// Back to top functionality
backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add loading screen
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

// Add click functionality to search suggestions
document.querySelectorAll('.suggestion').forEach(suggestion => {
    suggestion.addEventListener('click', () => {
        searchInput.value = suggestion.textContent.trim();
        performSearch();
    });
});

console.log('Crete Travel Directory with Ocean Theme loaded successfully!');

let allPartners = [];

// Icons for different categories
const categoryIcons = {
    'accommodations': 'bed',
    'restaurants': 'utensils', 
    'taxi': 'taxi',
    'boats': 'ship',
    'excursions': 'mountain',
    'rent-car': 'car',
    'weddings': 'users'
};

// Load partners data
async function loadPartners(category, iconName = null) {
    try {
        const response = await fetch('partners_data.json');
        allPartners = await response.json();
        
        // Load images data
        let imagesData = {};
        try {
            const imagesResponse = await fetch('partners_images.json');
            imagesData = await imagesResponse.json();
        } catch (error) {
            console.log('Images data not available');
        }
        
        displayPartners(category, iconName || categoryIcons[category] || 'store', imagesData);
    } catch (error) {
        console.error('Error loading partners:', error);
        showError();
    }
}

function displayPartners(category, iconName, imagesData = {}) {
    const partnersGrid = document.getElementById('partnersGrid');
    const categoryPartners = allPartners.filter(partner => partner.category === category);
    
    if (categoryPartners.length === 0) {
        partnersGrid.innerHTML = `
            <div class="no-partners">
                <p>No partners found in this category yet.</p>
                <p>Check back soon for more listings!</p>
            </div>
        `;
        return;
    }

    partnersGrid.innerHTML = categoryPartners.map(partner => {
        // Get first image for preview
        let imageHtml = `<i class="fas fa-${iconName}"></i>`;
        
        // Use the getPartnerImage function from script.js
        const imageUrl = getPartnerImage(partner);
        if (imageUrl && !imageUrl.includes('unsplash.com')) {
            imageHtml = `<img src="${imageUrl}" alt="${partner.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                         <i class="fas fa-${iconName}" style="display: none;"></i>`;
        }
        
        return `
            <div class="partner-card">
                <div class="partner-image">
                    ${imageHtml}
                </div>
                <div class="partner-content">
                    <h3 class="partner-name">${partner.name}</h3>
                    <div class="partner-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${partner.location}
                    </div>
                    <p class="partner-description">${partner.description}</p>
                    <div class="partner-contact">
                        ${partner.phone ? `
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <span>${partner.phone}</span>
                            </div>
                        ` : ''}
                        ${partner.email ? `
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <span>${partner.email.length > 25 ? partner.email.substring(0, 22) + '...' : partner.email}</span>
                            </div>
                        ` : ''}
                        ${partner.website ? `
                            <div class="contact-item">
                                <i class="fas fa-globe"></i>
                                <span>Website</span>
                            </div>
                        ` : ''}
                    </div>
                    <button class="view-details-btn" onclick="viewPartnerDetails('${partner.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function viewPartnerDetails(partnerId) {
    window.location.href = `partner-details.html?id=${partnerId}`;
}

function showError() {
    const partnersGrid = document.getElementById('partnersGrid');
    partnersGrid.innerHTML = `
        <div class="no-partners">
            <p>Error loading partners data.</p>
            <p>Please try refreshing the page.</p>
        </div>
    `;
}

// Configurare pentru URL-urile imaginilor
const IMAGE_CONFIG = {
    // URL-ul de bază pentru imaginile de pe GitHub LFS
    // Înlocuiește cu URL-ul tău real după ce faci push pe GitHub
    baseUrl: "https://alinciobotar.github.io/CreteInfo",
    
    // Fallback pentru dezvoltare locală
    localFallback: true,
    
    // URL-ul pentru imaginile de pe Cloudflare R2
    cloudflareUrl: "https://pub-aff3cad8c0fa444e896b858926acb63b.r2.dev",
    
    // Relative base path for project-hosted images
    imagesBasePath: "images",
    
    // Calea către imaginile comprimate
    compressedPath: "images/partners-compressed",
    
    // Calea către imaginile originale (fallback)
    originalPath: "images/partners"
};

// Funcție pentru a obține URL-ul complet al unei imagini
function getImageUrl(folder, imageName, useCompressed = true) {
    // Opțiunea 1: Folosește Cloudflare R2 (actual)
    // const fileName = `${folder}-${imageName}`;
    // return `${IMAGE_CONFIG.cloudflareUrl}/${fileName}`;
    
    // Use relative paths so they work in local and GitHub Pages deployments
    return `${IMAGE_CONFIG.imagesBasePath}/${folder}/${imageName}`;
    
    // Opțiunea 3: Folosește GitHub Pages
    // return `${IMAGE_CONFIG.baseUrl}/${IMAGE_CONFIG.compressedPath}/${folder}/${imageName}`;
}

// Funcție pentru a obține URL-ul cu fallback automat
function getImageUrlWithFallback(folder, imageName) {
    const primaryUrl = getImageUrl(folder, imageName, true);
    
    // Local fallback path, also relative and case-sensitive
    const fallbackUrl = `${IMAGE_CONFIG.imagesBasePath}/${folder}/${imageName}`;
    
    return {
        primary: primaryUrl,
        fallback: fallbackUrl
    };
}

// Export pentru a fi folosit în alte fișiere
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IMAGE_CONFIG, getImageUrl, getImageUrlWithFallback };
}

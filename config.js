// Configurare pentru URL-urile imaginilor
const IMAGE_CONFIG = {
    // URL-ul de bază pentru imaginile de pe GitHub LFS
    // Înlocuiește cu URL-ul tău real după ce faci push pe GitHub
    baseUrl: "https://alinciobotar.github.io/CreteInfo",
    
    // Fallback pentru dezvoltare locală
    localFallback: true,
    
    // URL-ul pentru imaginile de pe Cloudflare R2
    cloudflareUrl: "https://pub-aff3cad8c0fa444e896b858926acb63b.r2.dev",
    
    // URL-ul pentru imaginile de pe Supabase Storage
    // Înlocuiește cu URL-ul tău real de Supabase
    supabaseUrl: "https://your-project-ref.supabase.co/storage/v1/object/public/your-bucket",
    
    // Calea către imaginile comprimate
    compressedPath: "images/partners-compressed",
    
    // Calea către imaginile originale (fallback)
    originalPath: "images/partners"
};

// Rădăcina site-ului pe GitHub Pages (merge și local): scoatem ultimul segment din path
function getSiteBasePath() {
    if (typeof window === 'undefined') return '';
    const path = window.location.pathname;
    // ex: /CreteInfo/index.html -> /CreteInfo/
    return path.replace(/\\/[^\\/]*$/, '/').replace(/\\/index\\.html$/, '').replace(/\\/$/, '/') || '/';
}

// Funcție pentru a obține URL-ul complet al unei imagini
function getImageUrl(folder, imageName, useCompressed = true) {
    // images/<client-name>/poze/<image-file> relative la rădăcina site-ului (user sau project page)
    const base = getSiteBasePath();
    return `${base}images/${folder}/poze/${imageName}`;
}

// Funcție pentru a obține URL-ul cu fallback automat
function getImageUrlWithFallback(folder, imageName) {
    const primaryUrl = getImageUrl(folder, imageName, true);

    // Fallback pentru dezvoltare locală (aceeași structură)
    const fallbackUrl = primaryUrl;

    return {
        primary: primaryUrl,
        fallback: fallbackUrl
    };
}

// Export pentru a fi folosit în alte fișiere
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IMAGE_CONFIG, getImageUrl, getImageUrlWithFallback };
}

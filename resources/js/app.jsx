import "./bootstrap";
import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";

// Tambahkan preload untuk font dan asset penting
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Preload beberapa asset penting saat idle
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'font';
        preloadLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
        preloadLink.crossOrigin = 'anonymous';
        document.head.appendChild(preloadLink);
    });
} else {
    // Fallback untuk browser yang tidak mendukung requestIdleCallback
    window.addEventListener('load', () => {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'font';
        preloadLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
        preloadLink.crossOrigin = 'anonymous';
        document.head.appendChild(preloadLink);
    });
}

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: false }); // Gunakan lazy loading
        return pages[`./Pages/${name}.jsx`]?.();
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
});
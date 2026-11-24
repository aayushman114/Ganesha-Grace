/**
 * Centralized Configuration for Ganesha Grace Frontend
 * Single source of truth for all URLs and constants
 */

// API Configuration
const CONFIG = {
    // Backend API base URL (must match backend server port)
    API_BASE_URL: 'http://127.0.0.1:3002/api',

    // Frontend server URL (for redirects, etc.)
    FRONTEND_URL: 'http://127.0.0.1:5501',

    // Storage keys
    CART_STORAGE_KEY: 'ganesh-grace-cart',

    // Session cookie name (for reference)
    SESSION_COOKIE: 'session',

    // Default pagination
    DEFAULT_PAGE_SIZE: 12,

    // Image placeholder (base64 SVG)
    PLACEHOLDER_IMAGE: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNTAwIiB2aWV3Qm94PSIwIDAgNCA1Ij48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+',
};

// Make config globally available
window.APP_CONFIG = CONFIG;

// Export for module usage (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
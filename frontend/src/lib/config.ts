/**
 * API base URL for backend requests.
 *
 * Local dev: VITE_API_URL or http://localhost:8010/api/v1
 * Vercel Services: /_/backend/api/v1 (matches backend routePrefix in vercel.json)
 */
export const getApiBaseUrl = (): string => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    if (import.meta.env.PROD) {
        return '/_/backend/api/v1';
    }
    return 'http://localhost:8010/api/v1';
};

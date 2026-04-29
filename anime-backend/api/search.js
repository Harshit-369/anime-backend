import { handleCors, sendResponse, sendError } from './_utils/cors.js';
import { fetchWithRetry } from './_utils/fetchWithRetry.js';

/**
 * GET /api/search?q={query}
 * Fetches anime from Jikan API v4
 */
export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;

  try {
    const { q } = req.query;
    
    if (!q || !q.trim()) {
      return sendError(res, 'Missing search query parameter "q"', 400);
    }

    const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=10&sfw=true`;
    
    console.log(`🔍 Searching for: ${q}`);
    
    const data = await fetchWithRetry(url);
    
    sendResponse(res, {
      success: true,
      query: q,
      total: data.pagination?.items?.total || 0,
      results: data.data || []
    });
  } catch (error) {
    console.error('Search error:', error);
    sendError(res, error.message || 'Failed to search anime');
  }
}

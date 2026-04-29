import { handleCors, sendResponse, sendError } from './_utils/cors.js';
import { fetchWithRetry } from './_utils/fetchWithRetry.js';

/**
 * GET /api/top?filter={filter}
 * Fetches top anime from Jikan API v4
 * Available filters: bypopularity, favorite, airing, upcoming
 */
export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;

  try {
    const filter = req.query.filter || 'bypopularity';
    const validFilters = ['bypopularity', 'favorite', 'airing', 'upcoming'];
    
    if (!validFilters.includes(filter)) {
      return sendError(res, `Invalid filter. Use: ${validFilters.join(', ')}`, 400);
    }

    const url = `https://api.jikan.moe/v4/top/anime?filter=${filter}&limit=20`;
    
    console.log(`🏆 Fetching top anime: ${filter}`);
    
    const data = await fetchWithRetry(url);
    
    sendResponse(res, {
      success: true,
      filter: filter,
      results: data.data || []
    });
  } catch (error) {
    console.error('Top anime error:', error);
    sendError(res, error.message || 'Failed to fetch top anime');
  }
}

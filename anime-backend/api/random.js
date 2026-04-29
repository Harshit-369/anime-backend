import { handleCors, sendResponse, sendError } from './_utils/cors.js';
import { fetchWithRetry } from './_utils/fetchWithRetry.js';

/**
 * GET /api/random
 * Fetches a random anime from Jikan API v4
 */
export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;

  try {
    const url = 'https://api.jikan.moe/v4/random/anime';
    
    console.log('🎲 Fetching random anime');
    
    const data = await fetchWithRetry(url);
    
    // Random anime returns a single object, not array
    const anime = data.data || null;
    
    if (!anime) {
      return sendError(res, 'No random anime found', 404);
    }

    sendResponse(res, {
      success: true,
      results: [anime] // Wrap in array for consistency
    });
  } catch (error) {
    console.error('Random anime error:', error);
    sendError(res, error.message || 'Failed to fetch random anime');
  }
}

import { handleCors, sendResponse, sendError } from './_utils/cors.js';
import { fetchWithRetry } from './_utils/fetchWithRetry.js';

/**
 * GET /api/seasonal
 * Fetches current season anime from Jikan API v4
 */
export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;

  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    
    let season = 'spring';
    if (month >= 1 && month <= 3) season = 'winter';
    else if (month >= 4 && month <= 6) season = 'spring';
    else if (month >= 7 && month <= 9) season = 'summer';
    else season = 'fall';

    const url = `https://api.jikan.moe/v4/seasons/${year}/${season}?limit=20&sfw=true`;
    
    console.log(`📅 Fetching seasonal anime: ${season} ${year}`);
    
    const data = await fetchWithRetry(url);
    
    sendResponse(res, {
      success: true,
      season: `${season} ${year}`,
      results: data.data || []
    });
  } catch (error) {
    console.error('Seasonal error:', error);
    sendError(res, error.message || 'Failed to fetch seasonal anime');
  }
}

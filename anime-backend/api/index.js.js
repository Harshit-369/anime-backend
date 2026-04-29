import { handleCors, sendResponse } from './_utils/cors.js';

/**
 * Root API handler - Health check and documentation
 */
export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;

  try {
    sendResponse(res, {
      status: 'ok',
      name: 'AnimeDecider Pro API',
      version: '1.0.0',
      endpoints: {
        search: '/api/search?q={query}',
        seasonal: '/api/seasonal',
        top: '/api/top?filter=bypopularity',
        random: '/api/random',
        youtube: '/api/youtube?q={query}'
      },
      docs: 'https://github.com/yourusername/anime-backend',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    sendResponse(res, {
      error: true,
      message: error.message
    }, 500);
  }
}
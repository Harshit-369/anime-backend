import { handleCors, sendResponse, sendError } from './_utils/cors.js';
import fetch from 'node-fetch';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3/search';

/**
 * GET /api/youtube?q={query}&maxResults={number}
 * Fetches anime trailers from YouTube Data API v3
 * Requires YOUTUBE_API_KEY environment variable
 */
export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;

  try {
    const { q, maxResults = 5 } = req.query;
    const API_KEY = process.env.YOUTUBE_API_KEY;

    if (!API_KEY) {
      return sendError(res, 'YouTube API key not configured', 500);
    }

    if (!q || !q.trim()) {
      return sendError(res, 'Missing search query parameter "q"', 400);
    }

    // Build YouTube API URL
    const params = new URLSearchParams({
      part: 'snippet',
      q: `${q} anime trailer`,
      maxResults: Math.min(parseInt(maxResults) || 5, 10),
      type: 'video',
      key: API_KEY,
      videoEmbeddable: true,
      relevanceLanguage: 'en'
    });

    const url = `${YOUTUBE_API_BASE}?${params.toString()}`;
    
    console.log(`📺 Fetching YouTube trailers for: ${q}`);

    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    // Format response for your frontend
    const videos = (data.items || []).map(item => ({
      id: item.id?.videoId,
      title: item.snippet?.title,
      description: item.snippet?.description,
      channel: item.snippet?.channelTitle,
      thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
      publishedAt: item.snippet?.publishedAt,
      embedUrl: `https://www.youtube.com/embed/${item.id?.videoId}?autoplay=0&rel=0`
    }));

    sendResponse(res, {
      success: true,
      query: q,
      totalResults: data.pageInfo?.totalResults || 0,
      results: videos
    });
  } catch (error) {
    console.error('YouTube API error:', error);
    sendError(res, error.message || 'Failed to fetch YouTube videos');
  }
}
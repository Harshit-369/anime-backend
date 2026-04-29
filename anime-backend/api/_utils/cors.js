/**
 * CORS middleware for Vercel serverless functions
 */

const defaultHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json'
};

/**
 * Handle CORS preflight requests
 */
export function handleCors(req, res) {
  // Set CORS headers
  Object.entries(defaultHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true; // Signal that request was handled
  }
  
  return false; // Continue processing
}

/**
 * Send JSON response with CORS headers
 */
export function sendResponse(res, data, statusCode = 200) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

/**
 * Send error response
 */
export function sendError(res, message, statusCode = 500) {
  sendResponse(res, {
    error: true,
    message: message,
    timestamp: new Date().toISOString()
  }, statusCode);
}

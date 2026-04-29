# AnimeDecider Pro - Backend API

Serverless Node.js backend for AnimeDecider Pro, deployed on Vercel.

## 🚀 Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/` | GET | Health check & API documentation |
| `/api/search?q={query}` | GET | Search anime via Jikan API v4 |
| `/api/seasonal` | GET | Current season anime |
| `/api/top?filter=bypopularity` | GET | Top anime (filters: bypopularity, favorite, airing) |
| `/api/random` | GET | Random anime pick |
| `/api/youtube?q={query}` | GET | YouTube trailer search |

## 🛠 Setup

1. **Clone & Install**
   ```bash
   git clone <your-repo-url>
   cd anime-backend
   npm install
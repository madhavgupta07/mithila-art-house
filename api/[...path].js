import app from '../server/app.js';
import { connectDB } from '../server/db.js';

// Serverless invocations reuse a warm instance, so keep one shared connection.
let dbReady;

async function ensureDb() {
  if (!dbReady) {
    dbReady = connectDB().catch((error) => {
      dbReady = null;
      throw error;
    });
  }
  return dbReady;
}

export default async function handler(req, res) {
  try {
    // Vercel sometimes hands the function a path without the /api prefix.
    // Express routes are mounted at /api, so normalise it in both cases.
    const url = req.url || '/';
    if (url !== '/api' && !url.startsWith('/api/')) {
      req.url = `/api${url.startsWith('/') ? '' : '/'}${url}`;
    }

    // Health checks should still answer when MongoDB is not configured.
    if (!req.url.startsWith('/api/health')) {
      await ensureDb();
    }

    return app(req, res);
  } catch (error) {
    console.error('[api] request failed:', error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: false, message: error.message || 'Internal server error.' }));
    }
  }
}

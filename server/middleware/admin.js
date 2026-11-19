import crypto from 'node:crypto';
import { config } from '../config.js';

// Deliberate lightweight placeholder: a single shared key is compared against
// the `x-admin-key` header. There are intentionally no user accounts, sessions
// or JWTs — replace this with real auth before exposing the API publicly.
export function requireAdmin(req, res, next) {
  if (!config.adminApiKey) {
    return res.status(503).json({
      ok: false,
      message: 'Admin access is not configured (ADMIN_API_KEY is missing).',
    });
  }

  const provided = req.get('x-admin-key');
  if (!provided) {
    return res.status(401).json({ ok: false, message: 'Admin key required.' });
  }

  const actual = Buffer.from(String(provided));
  const expected = Buffer.from(config.adminApiKey);
  // Guard the length first: timingSafeEqual throws when buffers differ in size.
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) {
    return res.status(401).json({ ok: false, message: 'Invalid admin key.' });
  }

  return next();
}

export default requireAdmin;

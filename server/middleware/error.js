export function notFoundHandler(req, res) {
  res.status(404).json({
    ok: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

// Express recognises error middleware by its four-argument signature.
export function errorHandler(error, _req, res, _next) {
  console.error('[error]', error);

  if (error.code === 11000) {
    return res.status(409).json({
      ok: false,
      message: 'A record with that unique value already exists.',
    });
  }

  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ ok: false, message: error.message });
  }

  const status = Number(error.status) >= 400 && Number(error.status) < 500
    ? Number(error.status)
    : 500;

  return res.status(status).json({
    ok: false,
    message: status === 500 ? 'Internal server error.' : error.message,
  });
}

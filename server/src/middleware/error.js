export function notFound(_req, res) {
  res.status(404).json({ error: 'Resource not found' });
}

export function errorHandler(err, _req, res, _next) {
  console.error(`[ERROR] ${err.message}`);

  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal server error' });
}

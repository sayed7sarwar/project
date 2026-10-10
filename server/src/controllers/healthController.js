export function healthCheck(_req, res) {
  res.json({
    status: 'ok',
    service: 'janmati-backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}

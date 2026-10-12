const geoip = require('geoip-lite');
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  const ip = req.ip || req.connection.remoteAddress;
  const geo = geoip.lookup(ip);

  if (!geo) {
    logger.warn(`Unable to determine location for IP: ${ip}`);
    return next();
  }

  const allowedCountries = process.env.ALLOWED_COUNTRIES.split(',');

  if (!allowedCountries.includes(geo.country)) {
    logger.warn(`Blocked access from ${geo.country} (IP: ${ip})`);
    return res.status(403).json({
      success: false,
      message: 'Access from your country is not allowed'
    });
  }

  next();
};

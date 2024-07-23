// logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // You can adjust the logging level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(), // Logs to console
    new winston.transports.File({ filename: 'app.log' }) // Logs to file
  ],
});

module.exports = logger;

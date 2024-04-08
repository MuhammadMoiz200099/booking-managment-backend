const pino = require('pino');
const winston = require('winston');
require('winston-daily-rotate-file');

const l = pino({
  name: process.env.APP_ID,
  level: process.env.LOG_LEVEL,
});

module.exports = l;

const transport = new winston.transports.DailyRotateFile({
  filename: './logs/crystal-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '10m',
  maxFiles: '2d'
});

exports.logger = winston.createLogger({
  transports: [
    transport
  ]
});
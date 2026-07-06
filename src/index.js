import cron from 'node-cron';
import { runMonitorCycle } from './services/monitor.js';
import { flushQueue } from './telegram/telegram.js';
import { config } from './config.js';
import { logger } from './utils/logger.js';

logger.info(`Mostaql Monitor Bot started! Checking every ${config.checkInterval} minute(s).`);

// Initial run
runMonitorCycle();

// Schedule regular checks
cron.schedule(`*/${config.checkInterval} * * * *`, () => {
    runMonitorCycle();
});

// Schedule queue flush check every hour at minute 5 (e.g. 08:05)
cron.schedule('5 * * * *', () => {
    flushQueue();
});

// Graceful shutdown handling
process.on('SIGINT', () => {
    logger.info('Shutting down gracefully...');
    process.exit(0);
});
process.on('SIGTERM', () => {
    logger.info('Shutting down gracefully...');
    process.exit(0);
});
import dotenv from 'dotenv';
dotenv.config();

export const config = {
    botToken: process.env.BOT_TOKEN,
    chatId: process.env.CHAT_ID,
    checkInterval: parseInt(process.env.CHECK_INTERVAL_MINUTES || '1', 10),
    projectUrl: process.env.PROJECT_URL || 'https://mostaql.com/projects',
    headless: process.env.HEADLESS === 'true',
    silentStart: process.env.SILENT_START ? parseInt(process.env.SILENT_START, 10) : null,
    silentEnd: process.env.SILENT_END ? parseInt(process.env.SILENT_END, 10) : null,
};

if (!config.botToken || !config.chatId) {
    console.error('❌ FATAL: BOT_TOKEN and CHAT_ID are required in .env');
    process.exit(1);
}
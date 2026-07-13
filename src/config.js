import dotenv from 'dotenv';
dotenv.config();

// 🚀 Self-cleaning logic: Removes spaces, quotes, and accidental "bot" prefixes
const cleanToken = (process.env.BOT_TOKEN || '')
    .trim()
    .replace(/^['"]|['"]$/g, '') // Removes quotation marks
    .replace(/^bot/i, '');       // Removes "bot" or "BOT" if accidentally pasted at the start

const cleanChatId = (process.env.CHAT_ID || '')
    .trim()
    .replace(/^['"]|['"]$/g, ''); // Removes quotation marks

export const config = {
    botToken: cleanToken,
    chatId: cleanChatId,
    checkInterval: parseInt(process.env.CHECK_INTERVAL_MINUTES || '1', 10),
    projectUrl: process.env.PROJECT_URL || 'https://mostaql.com/projects',
    headless: process.env.HEADLESS === 'true',
    silentStart: process.env.SILENT_START ? parseInt(process.env.SILENT_START, 10) : null,
    silentEnd: process.env.SILENT_END ? parseInt(process.env.SILENT_END, 10) : null,
};

// 🔍 Diagnostic Preview (Prints to Render logs so we can verify)
const maskedToken = config.botToken 
    ? `${config.botToken.slice(0, 6)}...[hidden]...${config.botToken.slice(-4)}` 
    : 'MISSING';
const maskedChatId = config.chatId 
    ? `${config.chatId.slice(0, 3)}...[hidden]` 
    : 'MISSING';

console.log(`[CONFIG DIAGNOSTIC] Loaded Token Preview: "${maskedToken}" (Length: ${config.botToken.length})`);
console.log(`[CONFIG DIAGNOSTIC] Loaded ChatID Preview: "${maskedChatId}"`);

if (!config.botToken || !config.chatId) {
    console.error('❌ FATAL: BOT_TOKEN and CHAT_ID are required in .env');
    process.exit(1);
}git add .
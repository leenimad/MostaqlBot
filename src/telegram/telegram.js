import axios from 'axios';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';
import { saveToQueue, getAndClearQueue } from '../storage/state.js';

function isSilentHour() {
    if (config.silentStart === null || config.silentEnd === null) return false;
    const currentHour = new Date().getHours();
    
    if (config.silentStart > config.silentEnd) {
        // Crosses midnight (e.g., 22:00 to 08:00)
        return currentHour >= config.silentStart || currentHour < config.silentEnd;
    }
    // Normal range (e.g., 01:00 to 05:00)
    return currentHour >= config.silentStart && currentHour < config.silentEnd;
}

export async function sendTelegramMessage(text) {
    if (isSilentHour()) {
        logger.info('Silent hours active. Queueing notification.');
        await saveToQueue(text);
        return;
    }

    const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
    try {
        await axios.post(url, {
            chat_id: config.chatId,
            text: text,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        });
        logger.success('Telegram notification sent successfully');
    } catch (error) {
        logger.error('Failed to send Telegram message', error.message);
    }
}

export async function flushQueue() {
    if (isSilentHour()) return;
    const queue = await getAndClearQueue();
    if (queue.length > 0) {
        logger.info(`Flushing ${queue.length} queued messages...`);
        for (const msg of queue) {
            await sendTelegramMessage(`<i>(Queued during silent hours)</i>\n\n${msg}`);
            await new Promise(res => setTimeout(res, 2000)); // Anti-spam delay
        }
    }
}

export function formatProjectMessage(project, evaluation) {
    let scoreMsg = `Score: ${evaluation.score}/10 (${evaluation.score > 5 ? 'Excellent' : 'Good'} Match)`;
    let proposalMsg = project.proposals ? `\nProposals: <b>${project.proposals}</b> (Great opportunity!)` : '';
    
    return `🚀 <b>New Mostaql Project</b>

<b>Title:</b>
${project.title}

<b>Budget:</b>
${project.budget}

<b>Published:</b>
${project.time} ${proposalMsg}

<b>Group:</b> ${evaluation.matchedGroup}
<b>Matched Keywords:</b>
${evaluation.matchedKeywords.join(', ')}

<b>Relevance:</b>
${scoreMsg}

<b>Link:</b>
${project.url}

-------------------------
<b>Description:</b>
<i>${project.description.substring(0, 150)}...</i>`;
}
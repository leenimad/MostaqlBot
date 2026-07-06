import { scrapeProjects } from '../scraper/scraper.js';
import { getProcessedProjects, saveProcessedProject } from '../storage/state.js';
import { evaluateProject } from '../filters/keywords.js';
import { sendTelegramMessage, formatProjectMessage } from '../telegram/telegram.js';
import { logger } from '../utils/logger.js';

export async function runMonitorCycle() {
    logger.info('Checking for new projects...');
    
    const projects = await scrapeProjects();
    if (!projects || projects.length === 0) {
        logger.info('No projects found this cycle.');
        return;
    }

    logger.info(`Found ${projects.length} projects on the page.`);
    const processedUrls = await getProcessedProjects();
    let newProjectsFound = false;

    for (const project of projects.reverse()) { // Reverse to process oldest to newest
        if (processedUrls.includes(project.url)) continue;

        newProjectsFound = true;
        
        const evaluation = evaluateProject(project.title, project.description);
        
        if (evaluation.isMatch) {
            logger.success(`Matched: ${project.title} (Score: ${evaluation.score})`);
            const message = formatProjectMessage(project, evaluation);
            await sendTelegramMessage(message);
        } else {
            logger.info(`Ignored: ${project.title} (No keywords matched)`);
        }

        // Mark as processed regardless of match to avoid re-evaluating
        await saveProcessedProject(project.url);
    }

    if (!newProjectsFound) {
        logger.info('No new projects. Waiting for next cycle.');
        logger.info('-----------------');
    }
}
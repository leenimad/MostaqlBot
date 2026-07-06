import fs from 'fs/promises';
import path from 'path';

const STATE_FILE = path.join(process.cwd(), 'data', 'state.json');
const QUEUE_FILE = path.join(process.cwd(), 'data', 'queue.json');

// Ensure data directory exists
await fs.mkdir(path.dirname(STATE_FILE), { recursive: true });

export async function getProcessedProjects() {
    try {
        const data = await fs.readFile(STATE_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function saveProcessedProject(url) {
    const projects = await getProcessedProjects();
    if (!projects.includes(url)) {
        projects.push(url);
        // Keep only the last 500 to prevent memory bloat
        if (projects.length > 500) projects.shift(); 
        await fs.writeFile(STATE_FILE, JSON.stringify(projects, null, 2));
    }
}

export async function saveToQueue(message) {
    let queue = [];
    try {
        const data = await fs.readFile(QUEUE_FILE, 'utf-8');
        queue = JSON.parse(data);
    } catch (e) { /* Ignore */ }
    queue.push(message);
    await fs.writeFile(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

export async function getAndClearQueue() {
    try {
        const data = await fs.readFile(QUEUE_FILE, 'utf-8');
        await fs.writeFile(QUEUE_FILE, '[]');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}
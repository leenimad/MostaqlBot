import axios from 'axios';
import * as cheerio from 'cheerio';
import { chromium } from 'playwright';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

let usePlaywright = false; // Dynamically switches to true if Axios gets blocked

export async function scrapeProjects() {
    if (usePlaywright) {
        return await scrapeWithPlaywright();
    }

 try {
        logger.info('Attempting fast scrape with Axios...');
        
        // 🚀 CACHE BUSTER: Appends a unique timestamp so Cloudflare never serves cached HTML
        const separator = config.projectUrl.includes('?') ? '&' : '?';
        const cacheBusterUrl = `${config.projectUrl}${separator}_t=${Date.now()}`;

        const { data } = await axios.get(cacheBusterUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'ar,en-US;q=0.7,en;q=0.3'
            },
            timeout: 10000
        });

        const projects = parseHtml(data);
        if (projects.length === 0) {
            logger.warn('Axios returned no projects. Cloudflare might be blocking. Switching to Playwright...');
            usePlaywright = true;
            return await scrapeWithPlaywright();
        }
        return projects;

    } catch (error) {
        logger.warn(`Axios scrape failed (${error.message}). Switching to Playwright dynamically...`);
        usePlaywright = true;
        return await scrapeWithPlaywright();
    }
}

async function scrapeWithPlaywright() {
    logger.info('Scraping with Playwright (Browser Mode)...');
    let browser;
    try {
        browser = await chromium.launch({ headless: config.headless });
        const page = await browser.newPage();
        
        // Add fake headers to bypass basic protections
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8'
        });

        await page.goto(config.projectUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        // Wait for the projects table/list to load
        await page.waitForSelector('.project-row, table tbody tr', { timeout: 10000 }).catch(() => {});

        const html = await page.content();
        await browser.close();
        return parseHtml(html);

    } catch (error) {
        if (browser) await browser.close();
        logger.error('Playwright scrape failed:', error.message);
        return [];
    }
}

function parseHtml(html) {
    const $ = cheerio.load(html);
    const projects = [];

    // NOTE: Selectors are based on typical Mostaql structure. They may need adjustment if Mostaql redesigns.
    $('tr.project-row, .project-row').each((i, el) => {
        const titleEl = $(el).find('h2 a, .project-title a');
        const url = titleEl.attr('href');
        const title = titleEl.text().trim();
        
        const budget = $(el).find('.project-budget, [title="الميزانية"]').text().trim() || 'N/A';
        const time = $(el).find('time').text().trim() || 'Just now';
        const proposals = $(el).find('.project-bids, [title="العروض"]').text().trim();
        const description = $(el).find('.project-details, .text-muted').text().trim();

        if (url && title) {
            projects.push({
                url: url.startsWith('http') ? url : `https://mostaql.com${url}`,
                title,
                budget,
                time,
                proposals: proposals ? parseInt(proposals, 10) : null,
                description
            });
        }
    });

    return projects;
}
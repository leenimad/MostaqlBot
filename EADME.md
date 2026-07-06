# Mostaql Project Monitor Bot 🚀

A  Node.js bot that monitors Mostaql for new projects, intelligently evaluates them against custom keyword scores, and sends instant Telegram notifications. 

Features dynamic fallback to Playwright to bypass Cloudflare and scraping protections!

## Features
- **Dynamic Scraping:** Tries fast Axios; falls back to Playwright if blocked.
- **Scoring System:** Assign weight to keywords (e.g., React = 3, HTML = 1).
- **Persistent State:** Saves processed projects so you never get duplicates.
- **Silent Hours:** Queues notifications during the night and sends them in the morning.
- **Cloud Ready:** Built to run on Render, Railway, or Fly.io 24/7.

## Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
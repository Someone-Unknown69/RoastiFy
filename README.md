# VibeiFy – Spotify Playlist Analyzer 🎵

## Overview
**VibeiFy** is a modern, Spotify-themed web app that lets you analyze any Spotify playlist with a single link. Get a detailed, AI-powered roast and psychoanalysis of your music taste, complete with responsive HTML reports, fun graphs, and Gen-Z sass. No login required!

## Features
- 🎧 **Paste & Analyze:** Enter any Spotify playlist URL and get instant insights.
- 🤖 **AI-Powered Reports:** Receive a fully styled, HTML/CSS report with mood analysis, artist dependencies, track roasts, and more.
- 📊 **Visualizations:** Responsive bar graphs, histograms, and SVGs (when possible).
- 📱 **Mobile-First Design:** Looks great on all devices.
- 🎨 **Spotify-Inspired Theme:** Dark mode, green accents, and modern UI.
- 🔒 **Privacy-Friendly:** No account or login needed.

## How It Works
1. **Paste** your Spotify playlist link on the homepage.
2. **Click Analyze** to let VibeiFy scan your playlist.
3. **Enjoy** a personalized, AI-generated roast and deep-dive report!

## Project Structure
```
spotify-playlist-analyzer/
├── public/
│   ├── index.html         # Landing page
│   ├── dashboard.html     # Report page
│   ├── style.css          # Main styles
│   ├── script.js          # Handles playlist input and navigation
│   ├── dashboard.js       # Fetches and renders AI report
│   └── assets/            # Images, logo, etc.
├── api/
│   ├── playlist.js        # Fetches playlist data from Spotify
│   └── report.js          # Generates AI-powered report
├── README.md
└── ... (other config files)
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Someone-Unknown69/VibeiFy.git
   cd VibeiFy
   ```

2. **Install dependencies (if using Node.js backend):**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file and add your Spotify API credentials and OpenRouter API key.

4. **Run the app locally:**
   - For static frontend: Open `public/index.html` in your browser.
   - For full-stack: Start your backend server (e.g., `npm run dev`).

## Usage

- Paste a Spotify playlist URL and click **Analyze**.
- Wait a few seconds for the AI to generate your personalized report.
- View and share your playlist roast!

## Tech Stack

- **Frontend:** HTML, CSS (Spotify dark theme), JavaScript
- **Backend:** Node.js (API routes), OpenRouter AI API, Spotify Web API

## License

MIT License.  
Feel free to fork, modify, and share!

---

**Made with ❤️ by Someone
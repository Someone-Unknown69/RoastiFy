const express = require("express");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require('fs')


dotenv.config();
const app = express();
app.use(cors());
app.use(express.static("public"));

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

let cachedToken = null;
let tokenExpiresAt = 0;

// Fetch access token using Client Credentials
async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;
  return cachedToken;
}

// API route to get public playlist tracks
app.get("/playlist/:id", async (req, res) => {
  try {
    const token = await getAccessToken();
    const playlistId = req.params.id;
    const url = `https://api.spotify.com/v1/playlists/${playlistId}`;

    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const playlistData = await response.json();
    res.json(playlistData);

    const tracks = playlistData.tracks.items.map(item => {
      const track = item.track;
      return {
        name: track.name,
        artists: track.artists.map(a => a.name).join(", "),
        album: item.track.album.name,
        track_id: item.track.id,
        popularity: track.popularity
      };
    });
    
    fs.writeFileSync("tracks.json", JSON.stringify(tracks, null, 2));
    console.log("tracks.json saved.");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching playlist");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

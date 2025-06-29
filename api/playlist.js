// api/playlist.js
import fetch from 'node-fetch';

let cachedToken = null;
let tokenExpiresAt = 0;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

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

export default async function handler(req, res) {
  try {
    const token = await getAccessToken();
    const { id } = req.query;
    const url = `https://api.spotify.com/v1/playlists/${id}`;

    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const playlistData = await response.json();

    const tracks = playlistData.tracks.items.map(item => {
      const track = item.track;
      return {
        name: track.name,
        artists: track.artists.map(a => a.name).join(", "),
        album: track.album.name,
        track_id: track.id,
        popularity: track.popularity
      };
    });

    res.status(200).json({ tracks });

  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
}

const express = require("express");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require('fs');
const querystring = require('querystring');
const axios = require("axios");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.static("public"));

const clientId = "479f4a99e51a4b3c8336586b1e2de3e5";
const clientSecret = "bccd71ed54444693b4a03186c3362257";
const redirect_uri = "http://localhost:3000/callback";

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

// Make the ruser log in

app.get("/login", (req, res) => {
  const scope = "user-read-private user-read-email user-top-read";
  const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: "code",
    client_id : clientId,
    scope,
    redirect_uri,
  })}`;
  res.redirect(authUrl);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code || null;

  try {
    const response = await axios.post("https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri,
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(clientId + ":" + clientSecret).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token } = response.data;
    res.redirect(`http://localhost:3000/dashboard?access_token=${access_token}`); // frontend
  } catch (err) {
    res.send("Error getting tokens");
  }
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});






















// app.get("/playlist/:id", async (req, res) => {
//   try {
//     const token = await getAccessToken();
//     const playlistId = req.params.id;
//     const url = `https://api.spotify.com/v1/playlists/${playlistId}`;

//     const response = await fetch(url, {
//       headers: {
//         "Authorization": `Bearer ${token}`
//       }
//     });

//     const playlistData = await response.json();

//     const tracks = await Promise.all(
//       playlistData.tracks.items.map(item => {
//         const track_id = item.track.id;
//         console.log(track_id)
//         const headers = { Authorization: `Bearer ${token}` };


//         console.log("Track:", item.track.name, "ID:", item.track.id);
//         console.log("Token:", token.slice(0, 20) + "...");
//         console.log("Features URL:", `https://api.spotify.com/v1/audio-features/${item.track.id}`);

//         async function getMetadata(trackId) {

//           // const [featuresRes, metaRes] = await Promise.all([
//             // fetch(`https://api.spotify.com/v1/audio-analysis/${trackId}`, { headers });
//             // fetch(`https://api.spotify.com/v1/tracks/${trackId}`, { headers }),
//           // ]);

//           // const meta = await metaRes.json();
//           // const features = await featuresRes.json();

//           const metaRes = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, { headers });
//           const meta = await metaRes.json();

//           return {
//             name: meta.name,
//             artist: meta.artists.map(a => a.name).join(", "),
//             album: meta.album.name,
//             popularity: meta.popularity,
//             duration_ms: meta.duration_ms,
//             release_date: meta.album.release_date,
//             image: meta.album.images?.[0]?.url,
//             preview_url: meta.preview_url,
//             // energy: features.energy,
//             // valence: features.valence,
//             // danceability: features.danceability,
//             // tempo: features.tempo,
//             // acousticness: features.acousticness,
//             // instrumentalness: features.instrumentalness,
//             // liveness: features.liveness,
//             // speechiness: features.speechiness,
//             // key: features.key,
//           };
//         }

//         return getMetadata(track_id);
//       })
//     );

//     const validTracks = tracks.filter(Boolean); // remove nulls
//     fs.writeFileSync("tracks.json", JSON.stringify(validTracks, null, 2));
//     console.log("tracks.json saved.");

//     res.json(validTracks); // move this to the end — send only the good data

//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching playlist");
//   }
// });

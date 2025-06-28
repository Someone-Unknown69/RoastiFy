# 🎵 Spotify Playlist Rater — API Integration Guide

> Build a web app that analyzes a user's Spotify playlist and gives vibe/mood ratings using the Spotify Web API.

---

## 🛠 Features

* ✅ Spotify OAuth login
* ✅ Fetch user's playlists
* ✅ Fetch tracks inside a playlist
* ✅ Get audio features like valence, energy, danceability
* ✅ Analyze genre via artist info
* ✅ Rate playlist based on mood, energy, etc.

---

## 🔧 Tools & APIs

| Feature        | Tool/API                   |
| -------------- | -------------------------- |
| Playlist data  | Spotify Web API            |
| Login & auth   | OAuth 2.0                  |
| Audio features | Spotify audio-features API |
| Web backend    | Node.js / Flask / Django   |
| Frontend       | React.js / HTML/CSS        |
| Genre analysis | Spotify artist API         |

---

## 📍 Step-by-Step Guide

### ✅ Step 1: Register a Spotify Developer App

1. Visit [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Save your `Client ID` and `Client Secret`
4. Set a Redirect URI, e.g., `http://localhost:3000/callback`

---

### 🛡️ Step 2: Spotify OAuth Login

Redirect users to the Spotify login URL:

```
https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID
&response_type=token
&redirect_uri=YOUR_CALLBACK_URL
&scope=playlist-read-private playlist-read-collaborative
```

Spotify will redirect back to:

```
http://localhost:3000/callback#access_token=XYZ123...
```

---

### 🎵 Step 3: Get Playlist Tracks

**Endpoint:**

```
GET https://api.spotify.com/v1/playlists/{playlist_id}/tracks
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Sample Response:**

```json
{
  "items": [
    {
      "track": {
        "id": "track_id",
        "name": "Song Name",
        "artists": [{ "name": "Artist", "id": "artist_id" }],
        "album": { "name": "Album" },
        "duration_ms": 210000,
        "popularity": 90
      }
    }
  ]
}
```

---

### 🎧 Step 4: Get Audio Features

**Endpoint:**

```
GET https://api.spotify.com/v1/audio-features?ids=track_id1,track_id2,...
```

**Sample Response:**

```json
{
  "audio_features": [
    {
      "id": "track_id",
      "danceability": 0.8,
      "energy": 0.7,
      "valence": 0.9,
      "tempo": 120.0,
      "acousticness": 0.2
    }
  ]
}
```

---

### 🎶 Step 5: Get Genre via Artist Info

**Steps:**

1. Get the `artist_id` from a track
2. Use this endpoint:

```
GET https://api.spotify.com/v1/artists/{artist_id}
```

**Sample Response:**

```json
{
  "genres": ["pop", "dance pop"]
}
```

---

## 💻 Sample JavaScript (Using Fetch API)

```js
const token = "YOUR_ACCESS_TOKEN";

fetch("https://api.spotify.com/v1/playlists/PLAYLIST_ID/tracks", {
  headers: {
    "Authorization": `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => {
  const trackIds = data.items.map(item => item.track.id).join(',');
  return fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
})
.then(res => res.json())
.then(audioData => {
  console.log(audioData.audio_features);
});
```

---

## 🪄 Resume Line Example

> Developed a web app that analyzes Spotify playlists using the Web API to generate vibe scores from audio features like energy, valence, and tempo. Integrated Spotify OAuth, data visualization, and genre-based mood feedback.

---

## 🧠 Bonus Feature Ideas

* Compare your playlist with a friend's
* Calculate a "Swiftie Score" based on Taylor Swift tracks
* “Sad girl energy” meter from valence & lyrics
* Generate dynamic mood playlists based on your analysis

---

## 🚨 Legal Note

This app idea is **compliant** with Spotify Developer Terms as long as:

* You **don’t stream or store** full songs
* You **use OAuth properly**
* You only use the **official Spotify Web APIs**

---

## 🤝 Need Help?

Need help building the API flow or integrating it with your frontend?

Just reach out — happy to help you turn your idea into a working product!

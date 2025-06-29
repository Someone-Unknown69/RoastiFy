const clientId = "479f4a99e51a4b3c8336586b1e2de3e5";
const redirectUri = "https://vibefy-git-main-someone-unknown69s-projects.vercel.app/callback.html";

function loginWithSpotify() {
  const scopes = ["playlist-read-private", "playlist-read-collaborative"];
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scopes.join(" "))}`;
  window.location.href = authUrl;
  console.log("Working");
}


async function analyzePlaylist() {
  const token = localStorage.getItem("spotify_token");
  if (!token) {
    alert("You must log in with Spotify first.");
    return;
  }

  const url = document.getElementById("playlistUrl").value;
  const playlistId = extractPlaylistId(url);
  if (!playlistId) {
    alert("Invalid playlist URL.");
    return;
  }

  const tracks = await getPlaylistTracks(playlistId, token);
  document.getElementById("output").textContent = JSON.stringify(
    tracks,
    null,
    2
  );
}

function extractPlaylistId(url) {
  const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

async function getPlaylistTracks(playlistId, token) {
  let allTracks = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const res = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${offset}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();

    const tracks = data.items.map((item) => ({
      name: item.track.name,
      artists: item.track.artists.map((a) => a.name),
      album: item.track.album.name,
      duration_ms: item.track.duration_ms,
      image: item.track.album.images?.[0]?.url,
      spotify_url: item.track.external_urls.spotify,
    }));

    allTracks = allTracks.concat(tracks);

    if (!data.next) break;
    offset += limit;
  }

  return allTracks;
}

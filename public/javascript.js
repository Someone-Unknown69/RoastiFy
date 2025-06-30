const access_token = new URLSearchParams(window.location.search).get("access_token");

fetch("https://api.spotify.com/v1/me/top/artists?limit=10", {
  headers: {
    Authorization: `Bearer ${access_token}`,
  },
})
.then(res => res.json())
.then(data => {
  console.log("Top Artists:", data);
})








// Extract playlist ID from Spotify URL
// function extractPlaylistId(url) {
//   try {
//     const parts = url.split("/playlist/");
//     if (parts.length < 2) return null;
//     const idPart = parts[1].split("?")[0];
//     return idPart;
//   } catch (e) {
//     return null;
//   }
// }

// async function fetchPlaylist() {
//   const url = document.getElementById("playlist-link").value;
//   const playlistId = extractPlaylistId(url);

//   if (!playlistId) {
//     document.getElementById("output").textContent = "Invalid playlist URL.";
//     return;
//   }

//   try {
//     const res = await fetch(`/playlist/${playlistId}`);
//     const data = await res.json();

//     if (data.error) {
//       document.getElementById("output").textContent =
//         "Error: " + data.error.message;
//     } else {
//       document.getElementById("output").textContent = "JSON file saved locally";
//     }
//   } catch (err) {
//     document.getElementById("output").textContent = "Failed to fetch playlist.";
//   }
// }


document.getElementById("analyze").addEventListener("click", fetchUserInfo);
async function fetchUserInfo() {
  const url = document.getElementById("UserId-link").value;
  const playlistId = extractPlaylistId(url);

  if (!playlistId) {
    document.getElementById("output").textContent = "Invalid playlist URL.";
    return;
  }

  try {
    const res = await fetch(`/playlist/${playlistId}`);
    const data = await res.json();

    if (data.error) {
      document.getElementById("output").textContent =
        "Error: " + data.error.message;
    } else {
      document.getElementById("output").textContent = "JSON file saved locally";
    }
  } catch (err) {
    document.getElementById("output").textContent = "Failed to fetch playlist.";
  }
}

document.getElementById("analyze").addEventListener("click", fetchPlaylist);

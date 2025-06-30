document.querySelector(".analyze-button").addEventListener("click", async () => {
  const url = document.getElementById("playlist-link").value;

  if (!url || !url.includes("playlist/")) {
    document.getElementById("output").textContent = "Please enter a valid Spotify playlist URL.";
    return;
  }

  try {
    const res = await fetch("/api/playlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playlistUrl: url }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch playlist data.");
    }

    const data = await res.json();
    localStorage.setItem("tracks", JSON.stringify(data.tracks));
    window.location.href = "/dashboard.html";
  } catch (err) {
    document.getElementById("output").textContent = "Error: " + err.message;
  }

});
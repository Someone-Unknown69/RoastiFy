const clientId = "479f4a99e51a4b3c8336586b1e2de3e5";
const redirectUri = "https://vibefy-theta.vercel.app/callback/";

function loginWithSpotify() {
    const scopes = ["playlist-read-private", "playlist-read-collaborative"];
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(" "))}`;
    window.location.href = authUrl;
    console.log("Working")
}


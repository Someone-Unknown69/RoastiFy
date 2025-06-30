const token = new URLSearchParams(window.location.search).get('token');
console.log(token);


async function getInfo(token) {
    try{
        const request = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
        headers: { Authorization: `Bearer ${token}` }
        });

        const data = await request.json();
        
        const tracksHtml = data.itms.map(track => `
                <div style="margin-bottom: 1em;">
                <img src="${track.album.images[0]?.url}" alt="cover" width="64" height="64" style="vertical-align:middle;">
                <strong>${track.name}</strong> by ${track.artists.map(a => a.name).join(', ')}
                <br>
                <em>${track.album.name}</em>
                <br>
                <a href="${track.external_urls.spotify}" target="_blank">Open in Spotify</a>
            </div>
        `).join('');


        document.body.innerHTML = `<h2>Your Top Tracks</h2>${tracksHtml}`;
    } catch(err) {
        console.log("Failed to fetch info")
    }

    
}
if (token) {
    getInfo(token)
}

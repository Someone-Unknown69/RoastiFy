const token = new URLSearchParams(window.location.search).get('token');

console.log(token);


async function getInfo(token) {
    try{
        const request = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
        headers: { Authorization: `Bearer ${token}` }
        });

        const data = await request.json();
    } catch(err) {
        console.log("Failed to fetch info")
    }

    document.body.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    
}
if (token) {
    getInfo(token)
}

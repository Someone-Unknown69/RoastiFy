export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { playlistUrl } = req.body;
  const playlistId = playlistUrl.split('/playlist/')[1].split('?')[0];

  // get access token
  const tokenRes = await fetch(`${req.headers.origin}/api/auth`);
  const { access_token } = await tokenRes.json();

  // fetch tracks
  const tracksRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const data = await tracksRes.json();
  const tracks = data.items.map(item => ({
    name: item.track.name,
    artist: item.track.artists.map(a => a.name).join(', '),
    id: item.track.id,
    popularity: item.track.popularity,
  }));
  res.status(200).json({ tracks });
}

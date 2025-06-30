export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).send("Missing code");

  const auth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI
    }),
  });

  const data = await response.json();

  if (data.access_token) {
    return res.redirect(`/dashboard.html?token=${data.access_token}`);
  } else {
    return res.status(400).json(data);  // This will show the actual error
  }
}

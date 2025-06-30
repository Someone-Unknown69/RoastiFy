export default function handler(req, res) {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
  const scopes = 'user-read-private user-read-email user-top-read';

  const url = `https://accounts.spotify.com/authorize?` +
    new URLSearchParams({
      response_type: 'code',
      client_id,
      scope: scopes,
      redirect_uri
    });

  res.redirect(url);
}

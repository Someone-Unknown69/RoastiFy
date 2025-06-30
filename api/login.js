import querystring from "querystring";

export default function handler(req, res) {
  const redirect_uri = "https://vibefy-theta.vercel.app/api/callback"; // change this!
  const scope = "user-read-private user-read-email user-top-read";

  const authUrl = "https://accounts.spotify.com/authorize?" + querystring.stringify({
    response_type: "code",
    client_id: process.env.CLIENT_ID,
    scope,
    redirect_uri
  });

  res.redirect(authUrl);
}

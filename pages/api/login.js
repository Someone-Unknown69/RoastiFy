import querystring from "querystring";

export default function handler(req, res) {
  const redirect_uri = "https://vibefy-theta.vercel.app/api/callback"; // change this!
  const scope = "user-read-private user-read-email user-top-read";
  const clientId = process.env.CLIENT_ID;
  if (!clientId) {
    res.status(500).send("CLIENT_ID environment variable is not set.");
    return;
  }
  const authUrl = "https://accounts.spotify.com/authorize?" + querystring.stringify({
    response_type: "code",
    client_id: clientId,
    scope,
    redirect_uri
  });
  console.log(authUrl);
  res.redirect(authUrl);
}

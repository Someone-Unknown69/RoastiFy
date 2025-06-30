app.get("/playlist/:id", async (req, res) => {
  try {
    const token = await getAccessToken();
    const playlistId = req.params.id;
    const url = `https://api.spotify.com/v1/playlists/${playlistId}`;

    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const playlistData = await response.json();

    const tracks = await Promise.all(
      playlistData.tracks.items.map(item => {
        const track_id = item.track.id;

        async function getMetadata(trackId) {
          const headers = { Authorization: `Bearer ${token}` };

          const [featuresRes, metaRes] = await Promise.all([
            fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, { headers }),
            fetch(`https://api.spotify.com/v1/tracks/${trackId}`, { headers }),
          ]);

          const meta = await metaRes.json();
          const features = await featuresRes.json();

          if (features.error) {
            console.log("error in collecting features for:", trackId);
            return null; // skip if error
          }

          return {
            name: meta.name,
            artist: meta.artists.map(a => a.name).join(", "),
            album: meta.album.name,
            popularity: meta.popularity,
            duration_ms: meta.duration_ms,
            release_date: meta.album.release_date,
            image: meta.album.images?.[0]?.url,
            preview_url: meta.preview_url,
            energy: features.energy,
            valence: features.valence,
            danceability: features.danceability,
            tempo: features.tempo,
            acousticness: features.acousticness,
            instrumentalness: features.instrumentalness,
            liveness: features.liveness,
            speechiness: features.speechiness,
            key: features.key,
          };
        }

        return getMetadata(track_id);
      })
    );

    const validTracks = tracks.filter(Boolean); // remove nulls
    fs.writeFileSync("tracks.json", JSON.stringify(validTracks, null, 2));
    console.log("tracks.json saved.");

    res.json(validTracks); // move this to the end — send only the good data

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching playlist");
  }
});

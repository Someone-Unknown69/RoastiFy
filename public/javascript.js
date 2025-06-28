// This file contains the JavaScript code that handles user input, fetches playlist data from the Spotify API, and updates the HTML to display the playlist information dynamically.

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('playlist-form');
    const playlistInput = document.getElementById('playlist-url');
    const playlistDetails = document.getElementById('playlist-details');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const playlistUrl = playlistInput.value;

        if (isValidSpotifyUrl(playlistUrl)) {
            fetchPlaylistData(playlistUrl);
        } else {
            alert('Please enter a valid Spotify playlist URL.');
        }
    });

    function isValidSpotifyUrl(url) {
        const regex = /^(https?:\/\/)?(www\.)?(spotify\.com\/playlist\/[a-zA-Z0-9]+)(\?.*)?$/;
        return regex.test(url);
    }

    function fetchPlaylistData(url) {
        const playlistId = url.split('/').pop().split('?')[0];
        const accessToken = 'YOUR_SPOTIFY_ACCESS_TOKEN'; // Replace with your Spotify access token

        fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayPlaylistDetails(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('Failed to fetch playlist data. Please try again later.');
        });
    }

    function displayPlaylistDetails(data) {
        const { name, description, images, tracks } = data;
        playlistDetails.innerHTML = `
            <h2>${name}</h2>
            <img src="${images[0].url}" alt="${name}" />
            <p>${description || 'No description available.'}</p>
            <h3>Tracks:</h3>
            <ul>
                ${tracks.items.map(item => `<li>${item.track.name} by ${item.track.artists.map(artist => artist.name).join(', ')}</li>`).join('')}
            </ul>
        `;
    }
});
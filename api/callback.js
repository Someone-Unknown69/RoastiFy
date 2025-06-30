export default function handler(req, res) {
  // Your callback logic here
  res.status(200).send("Callback working!");
}

// window.onload = async () => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const code = urlParams.get('code');

//   if (!code) {
//     console.error('No code found in URL');
//     return;
//   }

//   try {
//     const response = await fetch('/api/callback', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ code })
//     });

//     const data = await response.json();

//     if (data.access_token) {
//       localStorage.setItem('access_token', data.access_token);
//       window.location.href = '/dashboard'; // or wherever you want
//     } else {
//       console.error('Token exchange failed:', data);
//     }
//   } catch (error) {
//     console.error('Error contacting backend:', error);
//   }
// };

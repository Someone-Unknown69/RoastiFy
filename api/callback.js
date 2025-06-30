window.onload = async () => {
    const URLParams = new URLSearchParams(window.location.search);
    const code = URLParams.get('code');

    if (!code) {
        console.log("code not recieved");
        return;
    }

    try {
        const response = await fetch('/api/callback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({code})
        });

        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        window.location.href = '/dashboard';
        console.log("Shit is workinng")

    } catch(err) {
        console.log(err)
    }

};
const https = require('https');

const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBh_V6zksIbaU7LfJZowk4uG-UnMuYT-rc";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log("Status Code:", res.statusCode);
        try {
            const json = JSON.parse(data);
            console.log(JSON.stringify(json, null, 2));
        } catch (e) {
            console.log("Raw Response:", data);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});

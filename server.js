const express = require('express');
// const fetch = require('node-fetch');
// const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
// const https = require('https')
// const http = require('http')
const fs = require('fs')


function startServer() {
    const app = express();

    // Redirect HTTP to HTTPS,
    // app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));
    // Logging for each request
    app.use((req, resp, next) => {
        console.log(req.path)
        const now = new Date();
        const time = `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`;
        const path = `"${req.method} ${req.path}"`;
        const m = `${req.ip} - ${time} - ${path}`;
        // eslint-disable-next-line no-console
        console.log(m);
        next();
    });

    // Handle requests for the data
    

    // Handle requests for static files
    app.use(express.static('public'));
    app.get('/', (req,res) => {
        res.sendFile('public/memory.html')
    })
    // Start the server
    // let httpsOptions = {
    //     'key': fs.readFileSync('./https/key.pem'),
    //     'cert': fs.readFileSync('./https/cert.pem')
    // }
    // return https.createServer(httpsOptions, app).listen('8000', () => {
    app.listen('8000', () => {
        // eslint-disable-next-line no-console
        console.log('Local DevServer Started on port 8000...');
    });
}

startServer();
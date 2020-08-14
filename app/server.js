const http = require('http');
const app = require('./app');

// call S3 to retrieve upload file to specified buck

const port = 5000;


const httpServer = http.createServer(app).listen(port);

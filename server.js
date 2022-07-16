const http = require('http');

const app = require('./app');

// http.createServer(function(req, res){
//     res.writeHead(200, {"Content-Type": "text/plain"});
//     res.write("Ejo");
//     res.end();
// }).listen(8888)


const server = http.createServer(app);
const port = 3000
server.listen(port);

server.once('listening', function () {
    console.info(`Started the server on http://localhost:${port}`);
});
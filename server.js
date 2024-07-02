const http = require('http');
const url = require("node:url");

const HOST = 'localhost';
const PORT = process.env.PORT || 8080;

const listener = (req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
  console.log(url.parse(req.url, true).pathname);

  if (req.method === "GET") {
    let rootURL = url.parse(req.url, true).pathname;
    if (rootURL === "/api/hello"){
      let q = url.parse(req.url, true).query;
      let name = q.visitor_name.replace('"', '').replace('"', '');

      let greeting = `Hello, ${name}!, the temperature is 11 degrees Celcius in New York`
      let ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || req.socket.remoteAddress

      console.log(req.connection.remoteAddress);
      console.log(req.headers['x-forwarded-for']);
      let message = {
        "client": "req.socket",
        "location": "NY",
        "greeting": greeting
      }
      console.log(q);
      res.end(JSON.stringify(message));
    }
    else res.end("could not get query");
  }
  //res.end("Something bad happened");
}

const server = http.createServer(listener);

server.listen(PORT, ()=>{
  console.log(`Server listening on ${PORT}`);
});
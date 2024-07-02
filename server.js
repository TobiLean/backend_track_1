const http = require('http');
const url = require("node:url");
//const fetch = require('node-fetch');
const axios = require('axios');

const HOST = 'localhost';
const PORT = process.env.PORT || 8080;

let requestOptions = {
  method: 'GET',
};

// fetch("https://api.geoapify.com/v1/ipinfo?&apiKey=37b4d84debf64f798d5ab1455f5c0424", requestOptions)
//   .then(response => response.json())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));

let config = {
  method: 'get',
  url: 'https://api.geoapify.com/v1/ipinfo?&apiKey=37b4d84debf64f798d5ab1455f5c0424',
  headers: { }
};

let location;

axios(config)
  .then(function (response) {
    location = response.data.city.name;
    console.log(location);
  })
  .catch(function (error) {
    console.log(error);
  });


const listener = (req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
  console.log(url.parse(req.url, true).pathname);

  if (req.method === "GET") {
    let rootURL = url.parse(req.url, true).pathname;
    if (rootURL === "/api/hello"){
      let q = url.parse(req.url, true).query;
      let name = q.visitor_name.replace('"', '').replace('"', '');

      let greeting = `Hello, ${name}!, the temperature is 11 degrees Celcius in New York`

      console.log(req.connection.remoteAddress);

      let clientIps = req.headers['x-forwarded-for'];
      let clientIpArray = clientIps.split(',');

      console.log(clientIpArray[0]);

      let ip= clientIpArray[0]

      let message = {
        "client_ip": ip,
        "location": location,
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
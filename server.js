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

// let config = {
//   method: 'get',
//   url: 'https://api.geoapify.com/v1/ipinfo?&apiKey=37b4d84debf64f798d5ab1455f5c0424',
//   headers: { }
// };

let location;
let temperature;
let t;

// axios(config)
//   .then(function (response) {
//     location = response.data.city.name;
//     console.log(location);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });


const listener = (req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
  console.log(url.parse(req.url, true).pathname);

  if (req.method === "GET") {
    let rootURL = url.parse(req.url, true).pathname;
    if (rootURL === "/api/hello"){
      let q = url.parse(req.url, true).query;
      let name = q.visitor_name.replace('"', '').replace('"', '');

      let greeting = `Hello, ${name}!, the temperature is ${t} degrees Celcius in ${location}`

      console.log(req.connection.remoteAddress);

      let clientIps = req.headers['x-forwarded-for'];
      let clientIpArray = clientIps.split(',');
      let ip= clientIpArray[0]

      fetch(`https://ipinfo.io/${ip}?token=6d87f15da732b5`).then(
        (response) => response.json()
      ).then(
        (jsonResponse) => {
          location = jsonResponse.city;
          //console.log(jsonResponse.ip, location);
        }
      )

      fetch(`https://api.weatherapi.com/v1/current.json?key=2db5af654f9d4b76ba1221907240207&q=${location}`).then(
        (response) => response.json()
      ).then(
        (jsonResponse) => {
          temperature = jsonResponse.current.temp_c;
          t = temperature.toString();
          console.log(t);
          //console.log(jsonResponse.ip, location);
        }
      )

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
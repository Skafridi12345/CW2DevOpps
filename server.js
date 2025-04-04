var http = require('http');
var requests = 0;
var podname = process.env.HOSTNAME || "localhost"; // Fallback if HOSTNAME not set
var startTime;
var host;

var handleRequest = function(request, response) {
  response.setHeader('Content-Type', 'text/plain');
  response.writeHead(200);
  response.write("DevOps Coursework 2! | Running on: ");
  response.write(host);
  response.end(" | v=0\n");
  console.log("Running On:", host, "| Total Requests:", ++requests, "| App Uptime:", (new Date() - startTime)/1000, "seconds", "| Log Time:", new Date());
};

var www = http.createServer(handleRequest);
www.listen(3000, '0.0.0.0', function () {  // Bind to 0.0.0.0:3000
  startTime = new Date();
  host = process.env.HOSTNAME || "localhost";
  console.log("Started At:", startTime, "| Running On:", host, "\n");
});

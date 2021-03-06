var http     = require("http");
var io       = require("socket.io");
var sys      = require("sys");

var nstatic  = require("node-static");

var SuperClass = require("superclass");
var Connection = require("./connection");

Server = module.exports = new SuperClass;

var fileServer = new nstatic.Server("./public");

Server.include({
  init: function(){
    this.httpServer = http.createServer(function(request, response){
      request.addListener("end", function() {

        fileServer.serve(request, response, function (err, res) {
          if (err) { // An error as occured
            sys.error("> Error serving " + request.url + " - " + err.message);
            response.writeHead(err.status, err.headers);
            response.end();
          } else { // The file was served successfully
            sys.log("Serving " + request.url + " - " + res.message);
          }
        });

      });
    });

    this.socket = io.listen(this.httpServer);
    this.socket.on("connection", function(stream){ new Connection(stream) });
  },
  
  listen: function(port){
    this.httpServer.listen(port || 8080);
  }
});
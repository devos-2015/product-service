var express = require('express');
var cors = require('cors');

// Define some default values if not set in environment
var PORT = process.env.PORT || 3000;
var SHUTDOWN_TIMEOUT = process.env.SHUTDOWN_TIMEOUT || 10000;
var SERVICE_CHECK_HTTP = process.env.SERVICE_CHECK_HTTP || '/healthcheck';

// Create a new express app
var app = express();

// Add CORS headers
app.use(cors());

// Add health check endpoint
app.get(SERVICE_CHECK_HTTP, function (req, res) {
  res.send({ message: 'OK' });
});

var allProducts = [];

//Object Product
function AddProduct(album,interpret,price)
{
    var product = { Album : album, Interpret : interpret, Price : price };
    allProducts.push(product);
}



// Add all other service routes
app.get('/GetAllProducts', function (req, res) {
    try {
        AddProduct("eins", "zwei", 1.99)

        res.status(200).send(JSON.stringify(allProducts));
    } catch (err) {
        res.status(500)
        console.log('Error %e ...', err);
    }

});

// Start the server
var server = app.listen(PORT);

console.log('Service listening on port %s ...', PORT);




////////////// GRACEFUL SHUTDOWN CODE ////

var gracefulShutdown = function () {
  console.log('Received kill signal, shutting down gracefully.');

  // First we try to stop the server smoothly
  server.close(function () {
    console.log('Closed out remaining connections.');
    process.exit();
  });

  // After SHUTDOWN_TIMEOUT we will forcefully kill the process in case it's still running
  setTimeout(function () {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit();
  }, SHUTDOWN_TIMEOUT);
};

// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown);

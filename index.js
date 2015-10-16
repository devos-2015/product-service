var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

// Define some default values if not set in environment
var PORT = process.env.PORT || 3000;
var SHUTDOWN_TIMEOUT = process.env.SHUTDOWN_TIMEOUT || 10000;
var SERVICE_CHECK_HTTP = process.env.SERVICE_CHECK_HTTP || '/healthcheck';

// Create a new express app
var app = express();

// Add CORS headers
app.use(cors());
app.use(bodyParser.json());

// Add health check endpoint
app.get(SERVICE_CHECK_HTTP, function (req, res) {
  res.send({ message: 'OK' });
});

function initialAdd()
{
    AddProduct("Best of 15 Years", "ABBA", 1.99)
    AddProduct("We are the Champions", "Queen", 1.79)
    AddProduct("Die Perfekte Welle", "Juli", 1.99)
    AddProduct("The Eye of the Tiger", "Survivor", 1.86)
}

function findById(source, id) {
    for (var i = 0; i < source.length; i++) {
        if (source[i].id == id) {
            return source[i];
        }
    }
    throw "Couldn't find object with id: " + id;
}

var allProducts = [];
var idIndexer = 0
//Object Product
function AddProduct(album,interpret,price)
{
    var product = { id: idIndexer, album : album, interpret : interpret, price : price };
    idIndexer++;
    allProducts.push(product);
    return product;
}

// Add all other service routes
app.get('/Products', function (req, res) {
    try {
        res.contentType('application/json').status(200).send(JSON.stringify(allProducts));
    } catch (err) {
        res.status(500).send('{"errorMessage" : "' + err + '"}');
        console.log('Error %s ', err);
    }
});

app.get('/Product/:id', function (res, req) {

});

app.post('/Products', function (req, res) {
    try {
        console.log("req: " + req);
        console.log("body: " + req.body);

        var product = req.body;

        var newProduct = AddProduct(product.album, product.interpret, product.price);
        res.status(201).location('/Products/' + newProduct.id).send();
    } catch (err) {
        res.status(500).send('{"errorMessage" : "' + err + '"}');
        console.log('Error %s', err);
    }
});


app.put('/Products/:id', function (req, res) {
    console.log("req: " + req);
    console.log("body: " + req.body);


    var newProduct = req.body;
    //newProduct.id = req.params.id;

    var product = findById(allProducts, req.params.id);
    allProducts[allProducts.indexOf(product)] = newProduct;
    res.send("Produkt mit id + " + req.params.id +" geändert ", req.params.id);
});

app.delete('/Products', function (req, res) {

});

//Initial einige Objekte hinzufügen
initialAdd()

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

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

function DeleteProduct(id)
{
    console.log("Delete Product with ID: " + id);
    var product = findById(allProducts, id);
    allProducts.splice(allProducts.indexOf(product), 1);
    console.log("Done deleting Product with ID: " +id+ " .");
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
        res.status(500).send('Fehler: ' + err);
    }
});

app.get('/Product/:id', function (res, req) {
    try {
        var product = findById(allProducts, req.params.id);
        res.contentType('application/json').status(200).location('/Products/' + product.id).send(JSON.stringify(product));
    } catch (err) {
        res.status(500).send('Fehler:' + err + '"}');
    }
});

app.post('/Products', function (req, res) {
    try {
        var product = req.body;
        var newProduct = AddProduct(product.album, product.interpret, product.price);
        res.contentType('application/json').status(201).location('/Products/' + newProduct.id).send(JSON.stringify(newProduct));
    } catch (err) {
        res.status(500).send('Fehler:' + err + '"}');
    }
});


app.put('/Products/:id', function (req, res) {
    var newProduct = req.body;
    if (newProduct.id == undefined)
        newProduct.id = req.params.id;
    if (newProduct.id != req.params.id)
        return res.status(401).send("die �bergebene Id in der Url stimmt nicht mit der im Body �berein.");

    var product = findById(allProducts, req.params.id);
    allProducts[allProducts.indexOf(product)] = newProduct;
    res.send("Produkt mit id + " + req.params.id +" ge�ndert ", req.params.id);
});

app.delete('/Products/:id', function (req, res) {
    try {
        console.log("req: " + req);

        DeleteProduct(req.params.id);
        res.status(200).send("Product with ID " + req.params.id + " deleted.")

    } catch (err) {
        res.status(500).send('{"errorMessage" : "' + err + '"}');
        console.log('Error %s', err);
    }
});

//Initial einige Objekte hinzuf�gen
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

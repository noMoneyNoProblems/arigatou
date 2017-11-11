var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var CONTACTS_COLLECTION = "contacts";

var app = express();
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
var mongoProdUri = process.env.MONGODB_URI;
var mongoDevUri = 'mongodb://localhost:27017/myproject';

//Specify default page to load
// var options = {
//   index: __dirname + "\\index.html"
// };

//Serve the react app located in dist
var distDir = __dirname + "\\dist";
console.log(distDir);
app.use(express.static(distDir));

console.log(process.env.MONGODB_URI)

//Connect to the database before starting the application server.
mongodb.MongoClient.connect(mongoProdUri, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// var server = app.listen(process.env.PORT || 8080, function () {
//   var port = server.address().port;
//   console.log("App now running on port", port);
// });

app.get("/api/test", function(req, res) {
  console.log("we received a request");
  res.status(200).json({res: "Yes, we received a request"})
});

app.get("/api/comicsList", function(req, res) {
  db.collection(CONTACTS_COLLECTION).find({

  }).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get contacts.");
    } else {
      res.status(200).json(docs);
    }
  });
});



app.get("/api/latest", function(req, res) {
  db.collection(CONTACTS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get contacts.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.put("/api/contacts", function(req, res) {
  var updatedContact = req.body;

  if (!req.body._id) {
    handleError(res, "Invalid user input", "Must provide an id.", 400);
  }

  db.collection(CONTACTS_COLLECTION).findOneAndUpdate({_id: updatedContact._id}).toArray(function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update contacts.");
    } else {
      res.status(200).json(doc.op[0]);
    }
  });
});


app.post("/api/contacts", function(req, res) {
  var newContact = req.body;

  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  }

  db.collection(CONTACTS_COLLECTION).insertOne(newContact, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new contact.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

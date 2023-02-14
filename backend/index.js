//https://stackoverflow.com/questions/5823722/how-to-serve-an-image-using-nodejs

var path = require('path');
var express = require('express');
var app = express();

// The database
//const MongoClient = require('mongodb').MongoClient;
const { MongoClient } = require("mongodb");
//const uri = "mongodb://test:password@127.0.0.1:27017/mydb";
// Unsecured database
const uri = "mongodb://127.0.0.1:27017";

var options = {
    index: "myWebPage.html"
  };

var dir = path.join(__dirname, '../frontend');



app.get('/api', function(req, res){
    res.send("Yes we have an API now")
});

app.use("/api/todolist", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });
  

app.post('/api/todolist', function(req, res){
    var n = req.query.todoNumber
    var s = req.query.todoText
    console.log("Storing todoList number: "+n+ " and item " + s )
    console.log("Mongo URI is "+uri)

    // Database stuff
    // Create a new MongoClient
    const client = new MongoClient(uri);
    async function run() {
    try {
        console.log('Start the database stuff');
        //Write databse Insert/Update/Query code here..
        var dbo = client.db("mydb");
        var myobj = { todoNumber: n, todoText: s };
        await dbo.collection("todo").insertOne(myobj, function(err, res) {
            if (err) {
                console.log(err); 
                throw err;
            }
        }); 
        console.log('End the database stuff');

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
    }
    run().catch(console.dir);
    res.send("stored "+n)
});

app.get('/api/todolist', function(req, res){
    console.log("getting the todolist")
    console.log("Mongo URI is "+uri)
    var response = "";
    const client = new MongoClient(uri);
    async function run() {
        try {
            const dbo = client.db("mydb");
            const query = {};
            const options = {
                sort: { todoNumber: 1  },
                projection: { todoNumber: 1, todoText: 1 },
            };
        
            const cursor = dbo.collection("todo").find(query, options);
            if ((await cursor.countDocuments) === 0) {
                console.log("No documents found!");
                response = ""
            }
            // prepare the response as an array
            const response = await cursor.toArray();
            res.send(response)
        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);
});
app.delete('/api/todolist', function(req, res){
    console.log("deleting the current todolist")
    console.log("Mongo URI is "+uri)
    const client = new MongoClient(uri);
    async function run() {
        try {
            console.log("starting up the database")
            const dbo = client.db("mydb");
            const query = {};
           
            console.log("deleting the collection")
            await dbo.collection("todo").deleteMany(query, function(err, result) {
                if (err) throw err;
            });
 
        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);
    res.send("Deleted list")
});

app.use(express.static(dir, options));

// 404 page
app.use(function ( req, res, next) {
    res.send('This page does not exist!')
});

app.listen(8000, function () {
    console.log('Listening on http://localhost:8000/');
});
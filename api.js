var express = require("express");
var mongoClient = require("mongodb").MongoClient;
var cors = require("cors");


var conString = "mongodb://localhost:27017";

var app = express();
app.use(cors());
app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());



app.get("/products",(req, res)=>{
    mongoClient.connect(conString,(err, clientObject)=>{
        if(!err){
            var database = clientObject.db("ishop");
            database.collection("products").find({}).toArray((err,documents)=>{
                if(!err){
                    res.send(documents);
                    res.end();
                }
            })
        }
    })
});
app.get("/details/:id",(req, res)=>{
    var id = parseInt(req.params.id);
    mongoClient.connect(conString,(err, clientObject)=>{
        if(!err){
            var database = clientObject.db("ishop");
            database.collection("products").find({ProductId:id}).toArray((err,document)=>{
                if(!err){
                    res.send(document);
                    res.end();
                }
            })
        }
    })
});

app.post("/addproduct",(req, res)=>{
    mongoClient.connect(conString, (err,clientObject)=>{
        if(!err){
            var database = clientObject.db("ishop");
            var product = {
                ProductId: parseInt(req.body.ProductId),
                Name: req.body.Name,
                Price: parseFloat(req.body.Price),
                Rating: {Rate: req.body.Rate, Count: req.body.Count},
                Category: req.body.Category
            }
            database.collection("products").insertOne(product,(err, result)=>{
                if(!err) {
                    console.log("Record Inserted");
                    res.redirect("/products");
                } else {
                    console.log(err);
                }
            })
        }
    })
});

app.put("/updateproduct",(req, res)=>{
     var findQuery = {
        ProductId: parseInt(req.body.ProductId)
     }
     mongoClient.connect(conString, (err, clientObject)=>{
        if(!err) {
            var database = clientObject.db("ishop");
            database.collection("products").updateOne(findQuery,{$set:{Name:req.body.Name, Price:parseFloat(req.body.Price), Stock:req.body.Stock, Rating: {Rate: req.body.Rate, Count: req.body.Count}}},(err, result)=>{
                if(!err){
                    console.log("Record Updated");
                    res.redirect("/products");
                }
            })
        }
     })
})

app.delete("/deleteproduct/:id",(req, res)=>{
    var id = parseInt(req.params.id);
    mongoClient.connect(conString,(err, clientObject)=>{
        if(!err){
            var database = clientObject.db("ishop");
            database.collection("products").deleteOne({ProductId:id},(err,result)=>{
                if(!err) {
                    console.log("Record Deleted");
                    res.redirect("/products");
                }
            })
        }
    })
});


app.listen(8080);
console.log("Server Started: http://127.0.0.1:8080")
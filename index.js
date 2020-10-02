var express = require('express');
var app = express();
const bodyParser = require('body-parser');
let server = require('./server');
let middleware = require('./middleware');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Connecting MongoDB
const MongoClient = require('mongodb').MongoClient;
const dbName = 'HospitalManagement';
const url = 'mongodb://localhost:27017';
let db
MongoClient.connect(url,{useUnifiedTopology:true},(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database : ${dbName}`);
    console.log("Successfully Connected Database.....");
});

//READ Hospital details
app.get('/hospital',middleware.checkToken,function(req,res){
    console.log("*****Hospital Collection*****");
    var data = db.collection('Hospital').find().toArray().then(result => res.json(result));
});

//READ Ventiolator details
app.get('/ventilator',middleware.checkToken,(req,res) =>{
    console.log("*****Ventiloator Collection*****");
    var ventilatordetail = db.collection('Ventilator').find().toArray().then(result => res.json(result));
});

//SEARCH  Ventilator by status
app.post('/ventilator/status',middleware.checkToken,(req,res) =>{
    console.log("Search-ventilator by status");
    var s1 = req.body.status;
    var ventilatordetails = db.collection('Ventilator').find({ "status" : s1 })
    .toArray().then(result => res.json(result));
});

//SEARCH  Ventilator by Hospital name
app.post('/ventilator/Hname',middleware.checkToken,(req,res) => {
    console.log("Search-ventilator by hospital name");
    var n1 =req.body.name;
    var ventilatordetail = db.collection('Ventilator').find({'name':new RegExp(n1,'i')})
    .toArray().then(result => res.json(result));
});

//SEARCH Hospital by name
app.post('/hospital/name',middleware.checkToken,(req,res)=>{
    console.log("Search-hospital by name");
    var n2=req.body.name;
    var hospitaldetails=db.collection('Hospital').find({'name':new RegExp(n2,'i')})
    .toArray().then(result=>res.json(result));
});

//UPDATE Ventilator details by VentID
app.put('/ventilator/u_ventid',middleware.checkToken,(req,res) =>{
    console.log("Update-ventilator details");
    var vid = { ventid: req.body.ventid };
    var new_value = { $set: { status: req.body.status } };
    db.collection('Ventilator').updateOne(vid, new_value,function (err, result){
        res.json('Document updated in Ventilator Collection');
        if(err) throw err;
    });
});

//Create Ventilator-document[add]
app.post('/ventilator/adduser',middleware.checkToken, (req,res) => {
    var item=
    {
        hid:req.body.hid, ventid:req.body.ventid, status:req.body.status, name:req.body.name
    };
    db.collection('Ventilator').insertOne(item, function (err, result){
        res.json('Added ventilator document');
    });
});

//Delete Ventilator by ventilatorid
app.delete('/ventilator/delete',middleware.checkToken,(req,res) => {
    var d1 = req.body.ventid;
    var d2 = { ventilatorId: d1 };
    db.collection('Ventilator').deleteOne(d2,function (err,obj)
    {
        if(err) throw err;
        res.json("Document deleted from ventilator collection");
    });
});

app.listen(7900);

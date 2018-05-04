const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/bears_dashboard");
var BearSchema = new mongoose.Schema({
    name: {type: String, required: true}
});
mongoose.model("Bear", BearSchema);
var Bear = mongoose.model("Bear");
app.get("/", function(req, res){
    Bear.find({}, function(err, bears){
        res.render("index", {bears: bears});
    });
});
app.get("/bears/new", function(req, res){
    res.render("new");
});
app.get("/bears/:id", function(req, res){
    Bear.findOne({_id: req.params.id}, function(err, bear){
        res.render("show", {bear: bear});
    });
});
app.get("/bears/edit/:id", function(req, res){
    Bear.findOne({_id: req.params.id}, function(err, bear){
        res.render("edit", {bear: bear});
    });
});
app.post("/bears", function(req, res){
    var bear = new Bear();
    bear.name = req.body.name;
    bear.save(function(err){
        if(err) {
            res.redirect("/bears/new");
        }
        else {
            res.redirect("/bears/" + bear._id);
        }
    });
});
app.post("/bears/:id", function(req, res){
    Bear.findOne({_id: req.params.id}, function(err, bear){
        bear.name = req.body.name;
        bear.save(function(err){
            if(err) {
                res.redirect("/bears/edit/" + bear._id);
            }
            else {
                res.redirect("/bears/" + bear._id);
            }
        });
    });
});
app.get("/bears/destroy/:id", function(req, res){
    Bear.remove({_id: req.params.id}, function(err){
        res.redirect("/");
    });
});
app.listen(8000);
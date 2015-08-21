var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var queryName;

router.use(express.static(__dirname + '/public'));

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


/*
router.get('/data', function(req, res) {
    var db = req.db;

    db.get('features').find( {},  function (err, items) {
        res.json(items);
    }); 
});

router.get('/data', function(req, res) {
    var db = req.db;

    name = req.body.data
    console.log(name)

    db.get('features').find( {"properties.Name" : {$eq: name }},  function (err, items) {
        res.json(items);
    }); 
});*/


module.exports = router;
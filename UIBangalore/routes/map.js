var express = require('express');
var router = express.Router();

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

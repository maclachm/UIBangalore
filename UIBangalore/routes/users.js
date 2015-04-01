var express = require('express');
var router = express.Router();


router.get('/data', function(req, res) {
    var db = req.db;

    db.get('features').find( {},  function (err, items) {
        res.json(items);
    }); 
});

/* router.get('/brands', function(req, res) {
        var db = req.db;
        var collection = db.get('brandcollection');
        collection.find({},{},function(e,docs){
            res.render('brands', {
                "brands" : docs
            });
        });
    });*/

module.exports = router;

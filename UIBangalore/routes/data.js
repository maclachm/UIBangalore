var express = require('express');
var router = express.Router();

router.get('/data', function(req, res) {
    var db = req.db;
    db.features.find().toArray(function (err, items) {
        res.json(items);
    });
});

module.exports = router;

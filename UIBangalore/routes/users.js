var express = require('express');
var router = express.Router();

router.get('/userlist', function(req, res) {
    var db = req.db;
    db.collection('features').find().toArray(function (err, items) {
        res.json(items);
    });
});

module.exports = router;

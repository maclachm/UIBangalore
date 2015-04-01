var express = require('express');
var router = express.Router();

router.use(express.static(__dirname + '/public'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'UI Bangalore' });
});

/* GET features 
router.get('/userlist', function(req, res) {
    var db = req.db;
    db.collection('features').find().toArray(function (err, items){
    	res.json(items);
    	});
    });
});*/

module.exports = router;

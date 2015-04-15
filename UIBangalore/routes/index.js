var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(express.static(__dirname + '/public'));

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'UI Bangalore' });
});

router.get('/map', function(req, res) {
  res.render('map', { title: 'UI Bangalore' });
});

router.get('/data', function(req, res, next) {
  res.render('map', { title: 'UI Bangalore' });
  next();
});

router.get('/data', function(req, res) {
    var db = req.db;


    var queryName = req.query.name;

    queryName = queryName.replace(/['"\\;{}]$/g,'') // strip misc/malicious chars

    db.get('features').find( {"properties.Name" : {$eq: name }},  function (err, items) {
        res.json(items);
    }); 
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

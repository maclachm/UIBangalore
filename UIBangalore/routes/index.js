var express = require('express');
var router = express.Router();

router.use(express.static(__dirname + '/public'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'UI Bangalore' });
});

module.exports = router;

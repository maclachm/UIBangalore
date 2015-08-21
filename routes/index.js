var express = require('express');
var router = express.Router();
var db = require('./db')

router.use(express.static(__dirname + '/public'));

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Urban Informatics Bangalore' });
});

//autocomplete
router.get('/auto/', function(req, res){
	//search landmarks & localities for autocorrect matches
	var limit = 7 //autocomplete limit
	var search = req.query.search
	var query = {}
	query.text = "SELECT title, concat('/map/point/', title) AS url, text, geom FROM (SELECT name AS title, locality AS text, st_asgeojson(geom) as geom FROM landmarks WHERE name ~* $1 UNION SELECT name AS title, name_alt AS text, st_asgeojson(geom) as geom FROM localities WHERE name ~* $1) AS q1 order by title <-> $1 LIMIT $2";
	query.values = [search, limit];

	db.query(query.text, query.values, function(err, data){
		//store results in result.results for search & autocomplete
		var result = {};
		//result.results = data.rows;

		result.results = data.rows.map(function(a){
			var b = a;
			b.url  = a.url+'/'+JSON.parse(a.geom).coordinates.toString().replace(',','/');
			return b;
		});

		res.json(result);
	});

});

//info pages

router.get('/methodology', function(req, res){
	res.render('methodology')
});

router.get('/about', function(req, res){
	res.render('about')
});

router.get('/chart', function(req, res){
	res.render('chart')
});
module.exports = router;

var express = require('express');
var router = express.Router();
var db = require('./db');

var count = 0;

router.use(express.static(__dirname + '/public'));

db.query('SELECT count(*) FROM landmarks', [], function(e,d){count = parseInt(d.rows[0].count)});

/* GET home page. */
router.get('/:page', function(req, res) {

	if (parseInt(req.params.page) > count/25 + 1){
		res.send('404: Page not Found', 404);
	}
	else{
		//search landmarks & localities for autocorrect matches
		var query = {}
		var offset = (req.params.page -1) * 25;
		query.values = [offset];

		query.text = "(SELECT id as id, 'localities' as table, name, name_alt AS text, st_asgeojson(geom) AS geom FROM localities order by name limit 25 offset $1) union (SELECT id as id, 'landmarks' AS table, name, locality AS text, st_asgeojson(geom) AS geom FROM landmarks order by name limit 25 offset $1) ORDER BY name";
		if (req.query.s){
			query.text = "(SELECT id as id, 'localities' as table, name, name_alt AS text, similarity(name, $2) AS sim, st_asgeojson(geom) AS geom FROM localities order by sim desc limit 25 offset $1) union (SELECT id as id, 'landmarks' AS table, name as g, locality AS text, similarity(name, $2) AS sim, st_asgeojson(geom) AS geom FROM landmarks order by sim desc limit 25 offset $1) order by sim desc";
			query.values = [offset, req.query.s]
		}



		db.query(query.text, query.values, function(err, data){
			//store results in result.results for search & autocomplete
			var result = {};
			//result.results = data.rows;
			result.landmarks = [];
			result.localities = [];

			data.rows.forEach(function(a,b,c){
				//var feat = {type:'feature', geometry: a.geom, properties:{name: a.name, text: a.text, table: a.table}};

				(a.table == 'landmarks') ? result.landmarks.push(a) : result.localities.push(a);
			});
			result.pages = parseInt((count/25) +1);

			res.render('localities', {localities: result.localities, landmarks: result.landmarks, pages: result.pages, current: req.params.page, query:req.query.s});
		});

	}

});

module.exports = router;
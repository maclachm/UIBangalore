/**
 * Created by anisha on 28/6/15.
 */
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('./db');

router.use(express.static(__dirname + '/public'));

router.get('/', function(req, res) {
    res.render('chart');
});
/* GET map. */
router.get('/:aptid', function(req, res) {
    var query = {};
    query.text = "SELECT lv_avg as lv, mv_avg as mv, rv_avg as rv, gv_approx as gv  FROM Apartments where id = $1"

    query.values = [req.params.aptid];


    var result = [];

    db.query(query.text, query.values, function(err, data){
        if (err) {
            console.error('error', err);
            res.status(500).send('Invalid Request');
        }
        else{

            var fields = data.fields.map(function(f) { return f.name; })
            // Gets the column names from the query as an array

            result = data.rows[0];
            console.log(result)
            var query = {};
            query.text = "SELECT  w.gv_approx as wgv, w.mv_avg as wmv, w.rv_avg as wrv, w.lv_avg as wlv from Ward as w, Apartments as a WHERE a.id = $1 and st_intersects(a.geom, w.geom)"
            query.values = [req.params.aptid];
            var result2 = [];
            db.query(query.text, query.values, function(err, data) {
                if (err) {
                    console.error('error', err);
                    res.status(500).send('Invalid Request');
                }
                else {
                    fields = data.fields.map(function(f) { return f.name; });
                    result2 = data.rows[0];

                    res.render('chart', {"aptdata": result, "warddata": result2});
                }
            });
        }

    });


});

module.exports = router;

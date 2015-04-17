var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(express.static(__dirname + '/public'));

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var googleApiKey = "AIzaSyBRiLzoPGoUOXwd0UFh-ivscYbEfoHVi8g"

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'UI Bangalore' });
});


var mapInit = function(req, res, attrObject) {

    res.render('map', attrObject);
}

//router.get('/data', [dbRet, mapInit]);

router.get('/data', function(req, res){

    mapAttributes = {} //jade attributes for map

    mapAttributes.title = req.query.name;
    mapAttributes.basePoint = [42, -83];
    //mapAttributes.layer = 
    //dbReq(mapAttributes.title, req, mapAttributes); 


    queryName = mapAttributes.title.replace(/['"\\;{}]$/g,'') // strip misc/malicious chars
    queryName = queryName.replace(/([b-d|f-h|j-n|p-t|v-z]){1,2}/g, '$1'+'+'); // regex to fix minor spelling inconsistencies/repeat chars


    var db = req.db;
    db.get('features').find( {"properties.Name" : {$regex: queryName }},  function (err, items) {
        if (err)
            return err

        //return items
        mapAttributes.featureObject = JSON.stringify(items);

        db.get('guidanceValues').find( {"VILLAGE/AREA/ROAD" : {$regex: queryName }},  function (err, values) {
        if (err)
            return err

        //return values
        mapAttributes.guidanceObject = JSON.stringify(values);

        //NB put in a different format, buffer, etc

        res.render('map', mapAttributes);
        }); 

    }); 


    //res.render('map', {title: value, basePoint: [42, -83], object: layer });
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

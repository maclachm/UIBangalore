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

    mapAttributes.title = req.query.name.replace(/^\s+|\s+$/g, '');
    mapAttributes.basePoint = [42, -83];
    //mapAttributes.layer = 
    //dbReq(mapAttributes.title, req, mapAttributes); 


    queryName = mapAttributes.title.replace(/['"\\;{}]$/g,'') // strip misc/malicious chars
    queryRegex = queryName.replace(/([^aeiou\s\b]){1}/g, '$1'+'+'); // regex to fix minor spelling inconsistencies/repeat chars

    //{$or: [{"properties.Name": {$regex: 'G'}}, {"properties.Name":{$eq: 'G'}}]})
    var db = req.db;
    db.get('features').find( {$or :[{"properties.Name" : {$eq: queryName }}, {"properties.Name" : {$regex: queryRegex }} ]},  function (err, items) {
        if (err)
            return err

        //return items
        mapAttributes.featureObject = JSON.stringify(items);

        db.get('guidanceValues').find( {$or :[{"VILLAGE/AREA/ROAD" : {$eq: queryName }}, {"VILLAGE/AREA/ROAD" : {$regex: queryRegex }} ]},  function (err, values) {
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

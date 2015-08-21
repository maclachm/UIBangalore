var pg = require('pg')
var express = require('express');
var router = express.Router();

var conString = "postgres://user1:1user2@urbaninformatics2.cfljnuakgbz7.ap-southeast-1.rds.amazonaws.com/urbaninformatics"


module.exports = {
	//can pass empty values array if no paramaters are supplied
	query: function(text, values, cb) {
      pg.connect(conString, function(err, client, done) {
        client.query(text, values, function(err, result) {
          done();
          cb(err, result);
        })
      });
   }
}




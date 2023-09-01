var express = require('express');
var router = express.Router();

var querystring = require('querystring');
var querystring = require('body-parser');

/* GET users listing. */
router.post('/:aspId', function(req, res, next) {
  const aspId = req.params.aspId;
  res.send("respond a resource for consumption-reporting with post for aspId:" + aspId);
  //res.send(`respond a resource for consumption-reporting with post for aspId:${aspId}`);
  
  console.log("1111 query");
  console.log(req.query);
  console.log("1111 params");
  console.log(req.params);
  console.log("1111 body");
  console.log(req.body);
  console.log("2222");
  
  
  
  var dataobj = null;
  var data = "";
  req.on('data', function (chunk) {     
       data += chunk;    
       console.log("1111");
       
       var dataobj = querystring.parse(data);
   });
       
   req.on('end', function () {       
       console.log("222");
   }); 
   
   setTimeout(function(){
       console.log(dataobj); 
   },1000); 
});

module.exports = router;
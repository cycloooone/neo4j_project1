var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');
var app = express();

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

const driver = neo4j.driver('bolt://3.80.164.196:7687',
                  neo4j.auth.basic('neo4j', 'pushdowns-suggestions-cords'), 
                  {/* encrypted: 'ENCRYPTION_OFF' */});
var session = driver.session();
var data = [];

app.get('/', function(req,res){
    
    res.render('index', {
          data:data
    })  
    
})

app.post('/school/find', function(req, res){
    var st1_id = req.body.student1_id;
    var st2_id = req.body.student2_id;
    console.log("this is student 1 id " + st1_id);
    console.log("this is student 2 id " + st2_id);
    session
        .run('MATCH (st1:N_ST{`IIN:ID`:$stud1})-[:RELATION_FINAL]->(s1:NODE_C), (stud2:N_ST{`IIN:ID`:$stud2})-[:RELATION_FINAL]->(s2:NODE_C) where s1 = s2 RETURN s1', {stud1:st1_id, stud2:st2_id})
        .then((result)=>{
            data = []
            result.records.forEach((record) => { 
                console.log(record._fields[0].properties);
                data.push(record._fields[0].properties);
                console.log(data)
                // data.push(record._fields[0].properties);
            });
            res.redirect('/');
        })
        .catch(function(err){
            console.log(err);
        });
});








app.listen(3000);
console.log('server is fucking running');

module.exports = app;
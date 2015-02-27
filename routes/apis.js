/**
 * Created by haifwu on 2015/2/27.
 */
var express = require('express'),
    app = express();
var routers = express.Router();
var mysql = require('mysql'),
    connectionpool = mysql.createPool({
        host     : 'localhost',
        user     : 'root',
        password : '123456',
        database : 'caldata'
    });

/* GET home page. */
routers.get('/:table', function(req,res){
    console.log("table name: " + req.params.table);
    //res.setHeader({'Content-Type': 'application/json'});
    connectionpool.getConnection(function(err, connection){
        if(err){
            console.error('CONNECTION error: ', err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err: err.code
            });
        } else{
            connection.query('SELECT * FROM ' + req.params.table + ' LIMIT 20', req.params.id, function(err, rows){
                if(err){
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err: err.code
                    });
                } else {
                    res.send({
                        result: 'success',
                        err: '',
                        json: rows,
                        length: rows.length
                    });
                }
                connection.release();
            });
        }
    })
});

module.exports = routers;
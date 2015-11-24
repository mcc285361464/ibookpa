var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'tiger',
  port     : '5006',
  database : 'bp'
});

module.exports = connection;

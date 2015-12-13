var express = require('express');
var app = express();
app.use('/static', express.static(__dirname));
app.use('/', express.static(__dirname + '/example'));
console.log('server start at port 8888');
app.listen(8888);

// if(process.env.NODE_ENV === 'test') {
//   console.log('console');
//   require('child_process').exec('mocha-casperjs test/example.js');
//   console.log('console');
// }

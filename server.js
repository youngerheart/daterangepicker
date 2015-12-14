var express = require('express');
var app = express();

app.use('/dist', express.static(__dirname + '/dist'));
app.use('/', express.static(__dirname + '/ghpages'));
console.log('server start at port 8888');
app.listen(8888);

if(process.env.NODE_ENV === 'test') {
  var proc = require('child_process').exec('mocha-casperjs test/index.js');
  proc.stdout.pipe(process.stdout);
  proc.on('exit', function() {
    process.exit();
  });
}

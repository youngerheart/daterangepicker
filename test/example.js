const chai = require('chai');
chai.should();
chai.use(require('sinon-chai'));

describe('searching', function() {
  
  before(function() {
    casper.start('http://localhost:8888/');
  })

  it('should recieve title', function() {
    casper.then(function() {
      this.echo('title is ' + this.getTitle());
      'daterangepicker demo'.should.equal(this.getTitle());
    });
  });
});

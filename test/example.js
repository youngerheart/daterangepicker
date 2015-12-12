const chai = require('chai');
chai.should();
chai.use(require('sinon-chai'));

describe('Baidu searching', function() {
  
  before(function() {
    casper.start('http://www.baidu.com/')
  })

  it('should retrieve title', function() {
    casper.then(function() {
      //this.echo(this.getTitle());
      '百度一下，你就知道'.should.equal(this.getTitle());
    });
  });
});

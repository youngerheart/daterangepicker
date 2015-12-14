const chai = require('chai');
require('./tool');
chai.should();
chai.use(require('sinon-chai'));

describe('Get page info', function() {
  
  before(function() {
    casper.options.waitTimeout = 30000;
    casper.on('page.initialized', function(){
      // 在webpack打包下会出现的问题
      // The problem is that PhantomJS v1.x does not support the Function.prototype.bind
      // 血的教训: http://stackoverflow.com/questions/25359247/casperjs-bind-issue
      this.evaluate(function(){
        var isFunction = function(o) {
          return typeof o == 'function';
        };

        var bind,
          slice = [].slice,
          proto = Function.prototype,
          featureMap;

        featureMap = {'function-bind': 'bind'};

        function has(feature) {
          var prop = featureMap[feature];
          return isFunction(proto[prop]);
        }

        // check for missing features
        if (!has('function-bind')) {
          // adapted from Mozilla Developer Network example at
          // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
          bind = function bind(obj) {
            var args = slice.call(arguments, 1),
              self = this,
              nop = function() {},
              bound = function() {
                return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));
              };
            nop.prototype = this.prototype || {}; // Firefox cries sometimes if prototype is undefined
            bound.prototype = new nop();
            return bound;
          };
          proto.bind = bind;
        }
      });
    });
    casper.on('page.error', function(msg, trace) {
      this.echo('Error: ' + msg, 'ERROR');
    });
    //casper.start('http://127.0.0.1:8888/')
    casper.start('http://elemefe.github.io/daterangepicker/')
    .waitForSelector('#drp-terminal .drp-calendar');
  });

  it('should receive title', function() {
    casper.then(function() {
      this.echo('title is ' + this.getTitle());
      'daterangepicker demo'.should.equal(this.getTitle());
    });
  });

  it('should have examples', function() {
    casper.then(function() {
      // 是否生成了控件
      // exists方法的selector居然可以用了
      this.exists('#drp-single .drp-calendar').should.be.true;
      this.echo('the #drp-single .drp-calendar exists');
      this.exists('#drp-range .drp-calendar').should.be.true;
      this.echo('the #drp-range .drp-calendar exists');
      this.exists('#drp-terminal .drp-calendar').should.be.true;
      this.echo('the #drp-terminal .drp-calendar exists');
    });
  });

  it('should revice current result', function() {
    // 首先点击setTime
    casper.then(function() {
      this.click('#setsingletime');
    }).then(function() {
      this.click('#setrangetime');
    }).then(function() {
      this.click('#setterminaltime');
    }).then(function() {
      this.exists('#drp-single .drp-day-number.focus[date="' + new Date().Format('yyyy-MM-dd') + '"]').should.be.true;
      this.echo('#drp-single-value is ok');
      this.exists('#drp-range .drp-day-number.focus[date="2015-10-11"]').should.be.true;
      this.exists('#drp-range .drp-day-number.focus[date="2015-11-11"]').should.be.true;
      this.echo('#drp-range-value is ok');
      this.exists('#drp-terminal .drp-day-number.focus[date="2015-10-11"]').should.be.true;
      this.exists('#drp-terminal .drp-day-number.focus[date="2015-11-11"]').should.be.true;
      this.echo('#drp-terminal-value is ok');
    });
  });
});

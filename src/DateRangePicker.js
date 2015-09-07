var Calendar = require('./Calendar');
var createElement = require('./tools/createElement');
var bind = require('./events/bind');
var clickEvents = require('./events/click');

function DateRangePicker(el, params) {
  this.init(el, params);
  // 其中应该保留有用的信息
}

DateRangePicker.prototype.init = function(el, params) {
  // 绘制Calendar
  new Calendar(el, params);
  el.className = 'drp';
  el.addEventListener('click', function(e) {
    bind(e, clickEvents);
  });
};


module.exports = DateRangePicker;

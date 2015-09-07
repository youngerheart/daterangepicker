var Calendar = require('./Calendar');
var createElement = require('./tools/createElement');


function DateRangePicker(el, params) {
  el.className = 'drp';
  // 绘制Calendar
  this.calendar = new Calendar(el, params);
}

module.exports = DateRangePicker;

var Calendar = require('./Calendar');

function DateRangePicker(el, params) {
  el.className = 'drp';
  this.calendar = new Calendar(el);
}

module.exports = DateRangePicker;

let drp = {}

var DateRangePicker = require('./src/DateRangePicker');

drp.init = function(el, params) {
  moment.locale(config.lang);
  return new DateRangePicker(el, params);
}
window.DateRangePicker = drp;
module.exports = drp;

let drp = {}

var DateRangePicker = require('./src/DateRangePicker');

drp.init = function(el, config) {
  moment.locale(config.lang || 'zh-cn');
  return new DateRangePicker(el, config);
}
window.DateRangePicker = drp;
module.exports = drp;

const Calendar = require('./Calendar');
const createElement = require('./tools/createElement');
const bind = require('./events/bind');
const clickEvents = require('./events/click');
const PubSub = require('./tools/pubsub');

function DateRangePicker(el, config) {
  this.init(el, config);
  // 保留有用的信息
  PubSub.set('config', config);
  PubSub.set('focusElements', [])
}

DateRangePicker.prototype.init = function(el, config) {
  // 绘制Calendar
  new Calendar(el, config.numberOfCalendars);
  el.className = 'drp';
  el.addEventListener('click', function(e) {
    bind(e, clickEvents);
  });
};


module.exports = DateRangePicker;

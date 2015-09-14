const Calendar = require('./Calendar');
const createElement = require('./tools/createElement');
const bind = require('./events/bind');
const {click, hover} = require('./events/events');
const PubSub = require('./tools/pubsub');

function DateRangePicker(el, config) {
  this.init(el, config);
  // 保留有用的信息
  PubSub.set('config', config);
  PubSub.set('focusElements', [])
}

DateRangePicker.prototype.init = function(el, config) {
  // 绘制Calendar
  click.target = el;
  hover.target = el;
  new Calendar(el, config.numberOfCalendars);
  el.className = 'drp';
  el.addEventListener('click', (e) => {
    bind(e, click);
  });
  el.addEventListener('mouseover', (e) => {
    bind(e, hover);
  });
};


module.exports = DateRangePicker;

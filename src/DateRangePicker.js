const PubSub = require('expubsub');
const Calendar = require('./Calendar');
const createElement = require('./tools/element').create;
const bind = require('./events/bind');
const {click, hover} = require('./events/events');

function DateRangePicker(el, config) {
  // 保留有用的信息
  PubSub.set('config', config);
  this.init(el, config);
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
  if(config.type === 'range' || config.type === 'terminal') {
    PubSub.emit('reload', el);
  }
};


module.exports = DateRangePicker;

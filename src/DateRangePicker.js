const PubSub = require('expubsub');
const Calendar = require('./Calendar');
const bind = require('./events/bind');
const {click, hover, reload, leave} = require('./events/events');
const leaveEvent = require('./tools/mouseleave');

function DateRangePicker(el, config) {
  // 保留有用的信息
  this.el = el;
  this.config = config;
  this.targetElements = []; // single时储存的点击元素
  this.rangeElements = [[], [], []]; // range，terminal时储存的元素
  this.firstItem = null;
  this.range = null;
  this.date = null;
  this.interval = null;
  this.init();
}

DateRangePicker.prototype.init = function() {
  // 绘制Calendar
  var {el, config} = this;
  moment.locale(config.lang || 'zh-cn');
  new Calendar(this, () => {
    reload(this);
  });
  el.className = 'drp';
  el.addEventListener('click', (e) => {
    bind(e, click, this);
  });
  el.addEventListener('mouseover', (e) => {
    bind(e, hover, this);
    if(!leaveEvent.getTarget(el)) leaveEvent.setTarget(el);
  });
  leaveEvent.add(el, () => {
    leave(this);
  });
  reload(this);
};



module.exports = DateRangePicker;

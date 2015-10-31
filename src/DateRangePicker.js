const Calendar = require('./Calendar');
const TimePicker = require('./TimePicker');
const bind = require('./events/bind');
const {click, hover, reload, leave} = require('./events/events');
const leaveEvent = require('./tools/mouseleave');

class DateRangePicker {
  constructor(el, config) {
    var {type, date, range, onSelect} = config;
    moment.locale(config.lang || 'zh-cn');
    // 保留有用的信息
    this.el = el;
    this.config = config;
    this.targetElements = []; // single时储存的点击元素
    this.rangeElements = [[], [], []]; // range，terminal时储存的元素
    this.firstItem = null;
    this.range = range || null;
    this.date = date || null;
    this.interval = null;
    this.time = null;
    this.maxDate = null;
    this.minDate = null;
    this.selectFunc = onSelect ? (date) => {
      if(!this.time) {
        onSelect(date);
        return;
      }
      var {hours, minutes} = this.time;
      if(type === 'single')  {
        date = date || this.date;
        this.date = date.hours(hours[0]).minutes(minutes[0]);
        onSelect(this.date);
      } else if (type === 'range' || type === 'terminal') {
        date = date || this.range;
        this.range.start = date.start.hours(hours[0]).minutes(minutes[0]);
        this.range.end = date.end.hours(hours[1]).minutes(minutes[1]);
        onSelect(this.range);
      }
    } : null;
    this.init();
  }

  init() {
    // 绘制Calendar
    var {el, config} = this;
    new Calendar(this, () => {
      reload(this);
    });
    if(config.time) this.time = new TimePicker(this);

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

    reload(this, true);
  };

  // 动态设置值的接口
  set(key, value) {
    if(this[key]) {
      this[key] = value;
      reload(this);
    }
  }
}


module.exports = DateRangePicker;

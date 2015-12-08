const Calendar = require('./Calendar');
const TimePicker = require('./TimePicker');
const Shortcuts = require('./Shortcuts');
const Dimension = require('./Dimension');
const bind = require('./events/bind');
const {click, hover, reload, leave} = require('./events/events');
const leaveEvent = require('./tools/mouseleave');
const EL = require('./tools/element');
const {zero} = require('./tools/getter');

class DateRangePicker {
  constructor(el, config) {
    var {type, date, range, onSelect, lang, shortcuts, dimension} = config;
    config.lang = lang = lang || 'zh-cn';
    // 保留有用的信息
    this.el = el;
    this.config = config;
    this.targetElements = []; // single时储存的点击元素
    this.rangeElements = [[], [], []]; // range，terminal时储存的元素
    this.firstItem = null;
    this.range = range ? (() => {
      range.start = range.start.locale(lang);
      range.end = range.end.locale(lang);
      return range;
    })() : null;
    this.date = date ? date.locale(lang) : null;
    this.interval = null;
    this.time = null;
    this.calendar = null;

    // 绑定shortcuts
    if(shortcuts && shortcuts.el) {
      this.shortcuts = new Shortcuts(this, shortcuts);
    }

    // 绑定dimension
    if(dimension && dimension.el && type === 'terminal') {
      this.dimension = new Dimension(this, shortcuts);
    }

    this.selectFunc = onSelect ? (date) => {
      if(type === 'single')  {
        date = date || this.date;
        if(this.shortcuts) this.shortcuts.setInput(type, date);
        if(!this.time) return onSelect(date);
        var {hours, minutes} = this.time;
        this.date = date.hours(hours[0]).minutes(minutes[0]);
        onSelect(this.date);
      } else if (type === 'range' || type === 'terminal') {
        date = date || this.range;
        if(this.shortcuts) this.shortcuts.setInput(type, date);
        if(!this.time) return onSelect(date);
        var {hours, minutes} = this.time;
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
    this.calendar = new Calendar(this, () => {
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
  }

  // 动态设置值的接口
  set(key, value) {
    if(typeof this[key] === 'undefined' || !value) return;
    var {type, lang} = this.config;
    if(key === 'date') {
      if(this.date && this.date.isSame(value)) return;
      value = value.locale(lang);
      if(this.shortcuts) this.shortcuts.setInput(type, value);
    } else if(key === 'range' || type === 'terminal') {
      if(this.range && this.range.isSame(value)) return;
      value.start = value.start.locale(lang);
      value.end = value.end.locale(lang);
      if(type === 'terminal') {
        this.interval = value.diff('days');
      }
      if(this.shortcuts) this.shortcuts.setInput(type, value);
    }
    this[key] = value;
    if(this.time) this.time.setTime(value);
    this.calendar.draw(value.start || value);
    reload(this);
  }

  clear() {
    var {el, date, range, config} = this;
    if(range) {
      EL.clear(el, range);
      this.range = null;
      if(this.time) this.time.setTime(moment.range([zero, zero]));
    }
    if(date) {
      EL.exchangeClass(this.targetElements, '', el, ['focus']);
      this.date = null;
      if(this.time) this.time.setTime(moment(zero));
    }
  }
}


module.exports = DateRangePicker;

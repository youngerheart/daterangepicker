const createElement = require('./tools/element').create;
const Lang = require('./lang');
const reload = require('./events/events').reload;
const exchangeButton = require('./tools/element').exchangeButton;

// 改变时间区段模块逻辑
class Dimension {
  constructor(that, config) {
    this.lang = Lang[that.config.lang];
    this.el = config.el;
    this.btns = config.btns;
    if(!this.btns || !this.btns.length) this.btns = ['day', 'week', 'month'];
    // 生成各个按钮
    this.btns.forEach((item, i) => {
      if(this.lang[item]) this.setBtn(that, this.lang[item], i);
    });
  };

  setBtn(that, str, index) {
    var btn = createElement('a', 'drp-btn' + (!index ? ' focus' : ''), str);
    var date = moment(that.date);
    var minDate = that.config.minDate;
    btn.addEventListener('click', (e) => {
      switch(e.target.innerHTML) {
        case this.lang.day:
          this.refresh(that, 'day');
          break;
        case this.lang.week:
          this.refresh(that, 'week');
          break;
        case this.lang.month:
          this.refresh(that, 'month');
          break;
      }
      exchangeButton(e.target, this.el);
    });
    this.el.appendChild(btn);
  };

  refresh(that, type) {
    that.calendar.type = type;
    var date = moment(that.date);
    date = date.startOf(type);
    if(date.isBefore(that.config.minDate)) date.add(1, 'week');
    if(date.isSame(that.date)) {
      that.calendar.draw(date);
      reload(that);
    } else {
      that.set('date', date.startOf(type));
    }
  }
}

module.exports = Dimension;

const createElement = require('./tools/element').create;
const {zero} = require('./tools/getter');

class TimePicker {
  constructor(that) {
    var {el, config, selectFunc} = that;
    this.el = el;
    this.config = config;
    this.selectFunc = selectFunc;
    this.hours = [];
    this.minutes = [];
    this.timeText = null;
    this.secondTimeText = null;
    this.input = [];
    this.init(that);
  }

  init(that) {
    var type = this.config.type;
    var timeBox = createElement('div', 'drp-time');
    this.timeText = createElement('div', 'drp-time-text');
    var thatZero = moment(zero);
    if(type === 'single') {
      timeBox.appendChild(this.timeText);
      timeBox.appendChild(this.createInput(true, that.date || thatZero));
      timeBox.appendChild(this.createInput(false, that.date || thatZero));
    } else if(type === 'range' || type === 'terminal') {
      this.secondTimeText = createElement('div', 'drp-time-text');
      var start = that.range ? that.range.start : thatZero;
      var end = that.range ? that.range.end : thatZero;
      timeBox.appendChild(
        this.insertItemBox(
          this.timeText,
          this.createInput(true, start, true),
          this.createInput(false, start, true)
        )
      );
      timeBox.appendChild(
        this.insertItemBox(
          this.secondTimeText,
          this.createInput(true, end, false),
          this.createInput(false, end, false)
        )
      );
    }
    this.el.appendChild(timeBox);
  };

  insertItemBox(text, rangeStart, rangeEnd) {
    var timeItemBox = createElement('div', 'drp-time-item');
    timeItemBox.appendChild(text);
    timeItemBox.appendChild(rangeStart);
    timeItemBox.appendChild(rangeEnd);
    return timeItemBox;
  }


  createInput(isHour, now, isStart) {
    var el = createElement('input', 'drp-time-input');
    el.type = 'range';
    el.min = 0;
    el.max = isHour ? 23 : 59;
    this.input.push(el);
    this.setParams(isHour, now, isStart);
    el.addEventListener('input', (e) => {
      now = isHour ? now.hours(e.target.value) : now.minutes(e.target.value);
      this.setParams(isHour, now, isStart);
      this.selectFunc(null);
    });
    return el;
  };

  setParams(isHour, now, isStart) {
    var type = this.config.type;
    if(type === 'single') {
      this.timeText.innerHTML = now.format('LT');
      if(isHour) this.input[0].value = this.hours[0] = now.format('HH');
      else this.input[1].value = this.minutes[0] = now.format('mm');
    } else if(type === 'range' || type === 'terminal') {
      if(isStart) {
        this.timeText.innerHTML = now.format('LT');
        if(isHour)  this.input[0].value =this.hours[0] = now.format('HH');
        else this.input[1].value = this.minutes[0] = now.format('mm');
      } else {
        this.secondTimeText.innerHTML = now.format('LT');
        if(isHour) this.input[2].value = this.hours[1] = now.format('HH');
        else this.input[3].value = this.minutes[1] = now.format('mm');
      }
    }
  };

  setTime(time) {
    var type = this.config.type;
    if(type === 'single') {
      this.setParams(true, time);
      this.setParams(false, time);
    } else if(type === 'range' || type === 'terminal') {
      this.setParams(true, time.start, true);
      this.setParams(false, time.start, true);
      this.setParams(true, time.end, false);
      this.setParams(false, time.end, false);
    }
  };
}

module.exports = TimePicker;

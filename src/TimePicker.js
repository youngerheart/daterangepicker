const createElement = require('./tools/element').create;

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
    this.init(that);
  }

  init(that) {
    var type = this.config.type;
    var timeBox = createElement('div', 'drp-time');
    this.timeText = createElement('div', 'drp-time-text');
    if(type === 'single') {
      timeBox.appendChild(this.timeText);
      timeBox.appendChild(this.createInput(true, that.date));
      timeBox.appendChild(this.createInput(false, that.date));
    } else if(type === 'range' || type === 'terminal') {
      this.secondTimeText = createElement('div', 'drp-time-text');
      timeBox.appendChild(
        this.insertItemBox(
          this.timeText,
          this.createInput(true, that.range.start, true),
          this.createInput(false, that.range.start, true)
        )
      );
      timeBox.appendChild(
        this.insertItemBox(
          this.secondTimeText,
          this.createInput(true, that.range.end, false),
          this.createInput(false, that.range.end, false)
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
    var current = isHour ? now.hours() : now.minutes();
    el.type = 'range';
    el.min = 0;
    el.max = isHour ? 23 : 59;
    el.defaultValue = current;
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
      if(isHour) this.hours[0] = now.format('HH');
      else this.minutes[0] = now.format('mm');
    } else if(type === 'range' || type === 'terminal') {
      if(isStart) {
        this.timeText.innerHTML = now.format('LT');
        if(isHour) this.hours[0] = now.format('HH');
        else this.minutes[0] = now.format('mm');
      } else {
        this.secondTimeText.innerHTML = now.format('LT');
        if(isHour) this.hours[1] = now.format('HH');
        else this.minutes[1] = now.format('mm');
      }
    }
  };
}

module.exports = TimePicker;

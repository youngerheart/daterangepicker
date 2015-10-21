const createElement = require('./tools/element').create;
// 传入元素，参数，初始化之

const today = moment();

class Calendar{
  constructor(that, callback) {
    // 渲染header, 再渲染多个月份的日历
    var {el, config} = that;
    this.el = el;
    this.calNum = config.numberOfCalendars;
    this.current = config.range ? moment(config.range[0]) : (config.date ? moment(config.date) : moment());
    this.reload = callback;
    this.draw();
  }

  draw() {
    // 清空之前的数据
    this.month = [];
    this.el.innerHTML = '';
    this.current = this.current.subtract(Math.ceil(this.calNum / 2), 'month');
    for(var i = 0; i < this.calNum; i++) {
      this.current = this.current.date(1).add(1, 'month');
      this.drawHeader(i);
      this.drawMonth(i);
    }
  }

  drawHeader(i) {
    var self = this;
    this.header = createElement('div', 'drp-header');
    this.title = createElement('div', 'drp-month', this.current.format('MMM YYYY'));
    if(!i) {
      var right = createElement('div', 'drp-right');
      right.addEventListener('click', function() {
        self.nextMonth();
      });

      var left = createElement('div', 'drp-left');
      left.addEventListener('click', function() {
        self.prevMonth();
      });
      this.header.appendChild(right);
      this.header.appendChild(left);
    }

    this.header.appendChild(this.title);
    
    this.el.appendChild(this.header);
    this.drawWeekDays();
    this.title.innerHTML = this.current.format('MMM YYYY');
  }

  drawMonth(num) {
    this.month.push(createElement('div', 'drp-month'));
    this.backFill();
    this.currentMonth();
    this.fowardFill();
    this.el.appendChild(this.month[this.month.length - 1]);
  }

  backFill() {
    var clone = this.current.clone();
    var dayOfWeek = clone.day();

    if (!dayOfWeek) {
      return;
    }

    clone.subtract(dayOfWeek + 1, 'days');

    for (var i = dayOfWeek; i > 0; i--) {
      this.drawDay(clone.add(1,'days'));
    }
  }

  fowardFill() {
    var clone = this.current.clone().add(1, 'months').subtract(1, 'days');
    var dayOfWeek = clone.day();

    if (dayOfWeek === 6) {
      return;
    }

    for (var i = dayOfWeek; i < 6; i++) {
      this.drawDay(clone.add(1, 'days'));
    }
  }

  currentMonth() {
    var clone = this.current.clone();

    while (clone.month() === this.current.month()) {
      this.drawDay(clone);
      clone.add(1, 'days');
    }
  }

  getWeek(day) {
    if (!this.week || day.day() === 0) {
      this.week = createElement('div', 'drp-week');
      this.month[this.month.length - 1].appendChild(this.week);
    }
  }

  drawDay(day) {
    var self = this;
    this.getWeek(day);

    //Outer Day
    var outer = createElement('div', this.getDayClass(day));

    //Day Number
    var number = createElement('div', 'drp-day-number', day.format('DD'));
    number.setAttribute('date', day.format('YYYY-MM-DD'));
    outer.appendChild(number);
    this.week.appendChild(outer);
  }

  getDayClass(day) {
    var classes = ['drp-day'];
    if (day.month() !== this.current.month()) {
      classes.push('drp-other');
    } else if (today.isSame(day, 'day')) {
      classes.push('drp-today');
    }
    return classes.join(' ');
  }

  drawWeekDays(el) {
    var self = this;
    this.weekDays = createElement('div', 'drp-week-days')
    // 获取一个星期的每一天
    var weekdays = [];
    for(var i = 0; i < 7; i++) {
      weekdays.push(moment().weekday(i - 1).format('ddd'));
    }
    weekdays.forEach(function(weekday) {
      var day = createElement('span', 'drp-day', weekday);
      self.weekDays.appendChild(day);
    })
    this.el.appendChild(this.weekDays);
  }

  nextMonth() {
    this.current.subtract(Math.floor(this.calNum / 2) - 1, 'months');
    this.next = true;
    this.draw();
    this.reload();
  }

  prevMonth() {
    this.current.subtract(Math.floor(this.calNum / 2) + 1, 'months');
    this.next = false;
    this.draw();
    this.reload();
  }
}

module.exports = Calendar;

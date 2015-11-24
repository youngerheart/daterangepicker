const createElement = require('./tools/element').create;
// 传入元素，参数，初始化之

const today = moment();

class Calendar{
  constructor(that, callback) {
    // 渲染header, 再渲染多个月份的日历
    var {el, config} = that;
    var {numberOfCalendars, lang, maxDate, minDate} = config;
    this.el = createElement('div', 'drp-calendar');
    this.parent = el;
    this.calNum = numberOfCalendars;
    this.current = that.range
                   ? moment(that.range.start)
                   : that.date ? moment(that.date) : moment();
    this.reload = callback;
    this.lang = lang;
    if(maxDate) this.maxDate = maxDate;
    if(minDate) this.minDate = minDate;
    this.draw();
    el.appendChild(this.el);
  }

  draw(current) {
    if(current) this.current = moment(current);
    moment.locale(this.lang || 'zh-cn');
    // 清空之前的数据
    this.el.innerHTML = '';
    this.month = [];
    this.current = this.current.subtract(Math.ceil(this.calNum / 2), 'month');
    this.drawPointer();
    for(var i = 0; i < this.calNum; i++) {
      this.current = this.current.date(1).add(1, 'month');
      this.drawHeader(i);
      this.drawMonth(i);
    }
  }

  drawPointer() {
    var right = createElement('div', 'drp-right');
    right.addEventListener('click', () => {
      this.nextMonth();
    });

    var left = createElement('div', 'drp-left');
    left.addEventListener('click', () => {
      this.prevMonth();
    });
    this.parent.appendChild(right);
    this.parent.appendChild(left);
  }

  drawHeader(i) {
    this.header = createElement('div', 'drp-header', this.current.format('MMM YYYY'));
    this.el.appendChild(this.header);
    this.drawWeekDays();
    this.header.innerHTML = this.current.format('MMM YYYY');
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
    this.getWeek(day);

    //Outer Day
    var outer = createElement('div', this.getDayClass(day));
    var className = 'drp-day-number';
    if((this.minDate && day.isBefore(this.minDate))
      || (this.maxDate && day.isAfter(this.maxDate))) className = 'drp-day-static';
    //Day Number
    var number = createElement('div', className, day.format('DD'));
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
    this.weekDays = createElement('div', 'drp-week-days');
    // 获取一个星期的每一天
    var weekdays = [];
    for(var i = 0; i < 7; i++) {
      weekdays.push(moment().weekday(i - 1).format('ddd'));
    }
    weekdays.forEach((weekday) => {
      var day = createElement('span', 'drp-day', weekday);
      this.weekDays.appendChild(day);
    });
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

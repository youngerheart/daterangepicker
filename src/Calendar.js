const createElement = require('./tools/element').create;
const Lang = require('./lang');
// 传入元素，参数，初始化之

const today = moment();

class Calendar{
  constructor(that, callback) {
    // 渲染header, 再渲染多个月份的日历
    var {el, config} = that;
    var {numberOfCalendars, lang, maxDate, minDate, calendar} = config;
    this.el = createElement('div', 'drp-calendar');
    this.unitEl = null;
    this.parent = el;
    this.calNum = numberOfCalendars;
    this.type = calendar || 'day';
    this.current = that.range
                   ? moment(that.range.start)
                   : that.date ? moment(that.date) : moment();
    this.reload = callback;
    this.lang = lang;
    this.langObj = Lang[lang];
    if(maxDate) this.maxDate = maxDate.endOf('day');
    if(minDate) this.minDate = minDate.startOf('day');
    this.draw();
    el.appendChild(this.el);
  }

  draw(current) {
    moment.locale(this.lang || 'zh-cn');
    if(current) this.current = moment(current);
    // 清空之前的数据
    this.el.innerHTML = '';
    this.month = [];
    this.quarter = [];
    this.year = [];
    this.week = null;
    this.isMonth = this.type === 'month';
    this.isWeek = this.type === 'week';
    if(this.isMonth) this.current = this.current.startOf('year');
    if(this.isWeek) this.current = this.current.startOf('month');
    this.current = this.current.subtract(Math.ceil(this.calNum / 2), 'month');
    this.drawPointer();
    for(var i = 0; i < this.calNum; i++) {
      this.unitEl = createElement('div', 'drp-unit');
      this.current = this.current.date(1).add(1, 'month');
      this.drawHeader(i);
      this.isMonth ? this.drawYear() : this.drawMonth();
      this.el.appendChild(this.unitEl);
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
    this.header = createElement('div', 'drp-header', this.current.format(this.isMonth ? 'YYYY' : 'YYYY MMM'));
    this.unitEl.appendChild(this.header);
    if(!this.isMonth && !this.isWeek) this.drawWeekDays();
  }

  drawMonth() {
    this.month.push(createElement('div', 'drp-month'));
    !this.isWeek && this.backFill();
    this.currentMonth();
    !this.isWeek && this.fowardFill();
    this.unitEl.appendChild(this.month[this.month.length - 1]);
  }

  drawYear() {
    this.year.push(createElement('div', 'drp-month'));
    this.currentYear();
    this.unitEl.appendChild(this.year[this.year.length - 1]);
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
      this.drawDay(clone, this.isMonth, 'sadfas');
      clone.add(1, this.isWeek ? 'weeks' : 'days');
    }
  }

  // 绘制年-月图
  currentYear() {
    var clone = this.current.clone();
    while(clone.year() === this.current.year()) {
      this.drawSingleMonth(clone);
      clone.add(1, 'months');
    }
  }

  getWeek(day) {
    if(this.isWeek) this.week = null;
    if(!this.week || day.day() === 0) {
      this.week = createElement('div', 'drp-week' + (this.isWeek ? ' longer' : ''));
      this.month[this.month.length - 1].appendChild(this.week);
    }
  }

  drawDay(day) {
    this.getWeek(day);
    day = this.fixDateStr(day.clone());
    //Outer Day
    var outer = createElement('div', this.getDayClass(day));
    var className = 'drp-day-number';
    //Day Number
    if((this.minDate && day.isBefore(this.minDate))
      || (this.maxDate && day.isAfter(this.maxDate))) className = 'drp-day-static';
    var dayStr = day.format('DD');
    var weekStr = day.format('WW') + this.langObj.week + ' (' + day.format('MM-DD') + '~' + moment(day).add(1, 'weeks').format('MM-DD') + ')';
    var number = createElement('div', className, this.isWeek ? weekStr : dayStr);
    number.setAttribute('date', day.format('YYYY-MM-DD'));
    outer.appendChild(number);
    this.week.appendChild(outer);
  }

  fixDateStr(day) {
    if(!this.isWeek) return day;
    day = day.startOf('week');
    return day;
  }

  // 绘制年-月图
  drawSingleMonth(month) {
    if([0, 3, 6, 9].indexOf(month.month()) !== -1) {
      this.quarter = createElement('div', 'drp-week');
      this.year[this.year.length - 1].appendChild(this.quarter);
    }

    var outer = createElement('div', 'drp-day');
    var className = 'drp-day-number';
    if((this.minDate && month.isBefore(this.minDate))
      || (this.maxDate && month.isAfter(this.maxDate))) className = 'drp-day-static';

    var number = createElement('div', className, month.format('MMM'));
    number.setAttribute('date', month.format('YYYY-MM-DD'));
    outer.appendChild(number);
    this.quarter.appendChild(outer);
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
    this.unitEl.appendChild(this.weekDays);
  }

  nextMonth() {
    this.current.subtract(Math.floor(this.calNum / 2) - 1, this.isMonth ? 'years' : 'months');
    this.next = true;
    this.draw();
    this.reload();
  }

  prevMonth() {
    this.current.subtract(Math.floor(this.calNum / 2) + 1, this.isMonth ? 'years' : 'months');
    this.next = false;
    this.draw();
    this.reload();
  }
}

module.exports = Calendar;

var createElement = require('./tools/createElement');
// 传入元素，参数，初始化之

var today = moment();

function Calendar(el, params) {
  // 渲染header, 再渲染多个月份的日历
  this.el = el;
  this.calNum = params.numberOfCalendars;
  this.current = moment().date(1);
  this.draw();
}

Calendar.prototype.draw = function() {

  // 清空之前的数据
  this.month = [];
  this.el.innerHTML = '';
  this.current = this.current.subtract(this.calNum - 1, 'month')
  for(var i = 0; i < this.calNum; i++) {
    this.current = this.current.date(1).add(i, 'month');
    this.drawHeader(i, this.calNum);
    this.drawMonth(i);
  }
}

Calendar.prototype.drawHeader = function(i, calNum) {
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

Calendar.prototype.drawMonth = function(num) {
  this.month.push(createElement('div', 'drp-month'));
  this.backFill();
  this.currentMonth();
  this.fowardFill();
  this.el.appendChild(this.month[this.month.length - 1]);
}

Calendar.prototype.backFill = function() {
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

Calendar.prototype.fowardFill = function() {
  var clone = this.current.clone().add(1, 'months').subtract(1, 'days');
  var dayOfWeek = clone.day();

  if (dayOfWeek === 6) {
    return;
  }

  for (var i = dayOfWeek; i < 6; i++) {
    this.drawDay(clone.add(1, 'days'));
  }
}

Calendar.prototype.currentMonth = function() {
  var clone = this.current.clone();

  while (clone.month() === this.current.month()) {
    this.drawDay(clone);
    clone.add(1, 'days');
  }
}

Calendar.prototype.getWeek = function(day) {
  if (!this.week || day.day() === 0) {
    this.week = createElement('div', 'drp-week');
    this.month[this.month.length - 1].appendChild(this.week);
  }
}

Calendar.prototype.drawDay = function(day) {
  var self = this;
  this.getWeek(day);

  //Outer Day
  var outer = createElement('div', this.getDayClass(day));

  //Day Number
  var number = createElement('div', 'drp-day-number', day.format('DD'));

  outer.appendChild(number);
  this.week.appendChild(outer);
}

Calendar.prototype.getDayClass = function(day) {
  var classes = ['drp-day'];
  if (day.month() !== this.current.month()) {
    classes.push('drp-other');
  } else if (today.isSame(day, 'day')) {
    classes.push('drp-today');
  }
  return classes.join(' ');
}

Calendar.prototype.drawWeekDays = function(el) {
  var self = this;
  this.weekDays = createElement('div', 'drp-week-days')
  // 获取一个星期的每一天
  var weekdays = [];
  for(var i = 0; i < 7; i++) {
    weekdays.push(moment().weekday(i).format('ddd'));
  }
  weekdays.forEach(function(weekday) {
    var day = createElement('span', 'drp-day', weekday);
    self.weekDays.appendChild(day);
  })
  this.el.appendChild(this.weekDays);
}

Calendar.prototype.nextMonth = function() {
  this.current.add(1, 'months');
  this.next = true;
  this.draw();
}

Calendar.prototype.prevMonth = function() {
  this.current.subtract(1, 'months');
  this.next = false;
  this.draw();
}


module.exports = Calendar;

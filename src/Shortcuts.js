const createElement = require('./tools/element').create;
const Lang = require('./lang');
const format = require('./tools/getter').format;

// 快速选择按钮逻辑
class Shortcuts {
  constructor(that, config) {
    this.lang = Lang[that.config.lang];
    this.el = config.el;
    this.btns = config.btns;
    this.dateEL = null;
    this.rangeStartEL = null;
    this.rangeEndEL = null;
    this.formEL = null;
    if(!this.btns || !this.btns.length) this.btns = ['today', 'yesterday', 'lastWeek', 'lastMonth', 'custom'];
    // 生成各个按钮
    this.btns.forEach((item) => {
      if(this.lang[item]) this.setBtn(that, this.lang[item]);
    });
    // 生成自定义表单
    this.formEL = createElement('form', 'drp-shortcuts-form');
    this.formEL.style.display = 'none';
    var selectBtnEL = createElement('button', 'drp-shortcuts-selectbtn', this.lang.select);
    selectBtnEL.type = 'button';
    if(this.btns.indexOf('custom') !== -1) {
      var {minDate, maxDate, type} = that.config;
      if(type === 'single') {
        this.dateEL = createElement('input', 'drp-shortcuts-input', format(that.date));
        this.formEL.appendChild(this.dateEL);
        this.formEL.appendChild(selectBtnEL);
        selectBtnEL.addEventListener('click', (e) => {
          var date = moment(this.dateEL.value);
          if(date.isValid()) {
            if(date.isBefore(minDate)) date = minDate;
            if(date.isAfter(maxDate)) date = maxDate;
            if(!date.isSame(that.date)) {
              that.set('date', date);
              that.selectFunc();
            }
          }
          this.dateEL.value = format(that.date);
        });
      } else {
        this.rangeStartEL = createElement('input', 'drp-shortcuts-input', format(that.range.start));
        this.rangeEndEL = createElement('input', 'drp-shortcuts-input', format(that.range.end));
        this.formEL.appendChild(this.rangeStartEL);
        this.formEL.appendChild(this.rangeEndEL);
        this.formEL.appendChild(selectBtnEL);
        selectBtnEL.addEventListener('click', (e) => {
          var start = moment(this.rangeStartEL.value);
          var end = moment(this.rangeEndEL.value);
          if(start.isValid() && end.isValid) {
            if(start.isAfter(end)) start = end;
            if(start.isBefore(minDate)) start = minDate;
            if(end.isAfter(maxDate)) end = maxDate;
            if(!moment.range(start, end).isSame(that.range)) {
              that.set('range', moment.range(start, end));
              that.selectFunc();
            }
          }
          this.rangeStartEL.value = format(that.range.start);
          this.rangeEndEL.value = format(that.range.end);
        });
      }
    }
    this.el.appendChild(this.formEL);
  }

  setBtn(that, str) {
    if(that.config.type === 'single' && (str === this.lang.lastWeek || str === this.lang.lastMonth)) return;
    var btn = createElement('a', 'drp-shortcuts-btn', str);

    btn.addEventListener('click', (e) => {

      var isSingle = that.config.type === 'single';
      var today = moment().startOf('day');
      var yesterday = moment().startOf('day').subtract(1, 'days');
      var pass = (this.btns.indexOf('today') !== -1 && this.btns.indexOf('yesterday') === -1);
      var lastWeek = moment.range(pass ? moment(yesterday).subtract(1, 'days')
        : moment(today).subtract(6, 'days'), pass ? yesterday : today);
      var lastMonth = moment.range(pass ? moment(yesterday).subtract(1, 'months').add(1, 'days')
        : moment(today).subtract(1, 'months').add(1, 'days'), pass ? yesterday : today);
      this.exchangeButton(e.target);
      this.formEL.style.display = 'none';
      switch(e.target.innerHTML) {
        case this.lang.today:
          if(isSingle) that.set('date', today);
          else that.set('range', moment.range(today, today));
          that.selectFunc();
          break;
        case this.lang.yesterday:
          if(isSingle) that.set('date', yesterday);
          else that.set('range', moment.range(yesterday, yesterday));
          that.selectFunc();
          break;
        case this.lang.lastWeek:
          if(!isSingle) that.set('range', lastWeek);
          that.selectFunc();
          break;
        case this.lang.lastMonth:
          if(!isSingle) that.set('range', lastMonth);
          that.selectFunc();
          break;
        case this.lang.custom:
          this.formEL.style.display = 'block';
          break;
      }
    });
    this.el.appendChild(btn);
  };

  setInput(type, date) {
    if(type === 'single') {
      this.dateEL.value = format(date);
    } else {
      this.rangeStartEL.value = format(date.start);
      this.rangeEndEL.value = format(date.end);
    }
  };

  exchangeButton(target) {
    Array.prototype.slice.call(this.el.querySelectorAll('.drp-shortcuts-btn')).forEach((item) => {
      item.classList.remove('focus');
    });

    target.classList.add('focus');
  };
}

module.exports = Shortcuts;

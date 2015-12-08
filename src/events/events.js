const getEBA = require('./../tools/getElementsByAttribute');
const EL = require('./../tools/element');
const getter = require('./../tools/getter');

module.exports = {
  reload(that, isInit) {
    var {date, range, config, rangeElements, interval, el, firstItem, targetElements} = that;
    switch(config.type) {
      case 'single':
        if(isInit) that.range = null;
        if(that.date) that.targetElements = EL.exchangeClass(targetElements, getter.format(that.date), el, ['focus']);
        break;
      case 'range':
        if(isInit) that.date = null;
        if(that.range) that.rangeElements = EL.choose(that.rangeElements, getter.format(that.range.start), getter.format(that.range.end), el, firstItem);
        break;
      case 'terminal':
        if(isInit) {
          that.date = null;
          that.interval = that.range.diff('days');
        }
        if(that.range) that.rangeElements = EL.choose(that.rangeElements, getter.format(that.range.start), getter.format(that.range.end), el);
        break;
    }
  },
  click: {
    'drp-day-number'(target, that) {
      var {range, config, rangeElements, el, firstItem, targetElements, interval, selectFunc} = that;
      var {maxDate, minDate} = config;
      // 直接返回这个时间的moment对象并设置class
      var chooseItem = getter.getDate(target);
      var chooseMoment = moment(chooseItem);
      
      // terminal的兼容性处理
      if(interval) {
        if(maxDate) {
          var max = moment(maxDate).subtract(interval, 'days');
          if(chooseMoment.isAfter(max)) {
            chooseMoment = max;
            chooseItem = getter.format(chooseMoment);
            firstItem = getter.format(moment(maxDate));
          }
        }
        if(minDate) {
          var min = moment(minDate);
          if(chooseMoment.isBefore(min)) {
            chooseMoment = min;
            chooseItem = getter.format(chooseMoment);
            firstItem = getter.format(moment(chooseMoment).add(interval, 'days'));
          }
        }
      }
      if((maxDate && chooseMoment.isAfter(maxDate)) || (minDate && chooseMoment.isBefore(minDate))) return;
      if(config.type === 'single') {
        that.date = chooseMoment;
        if(selectFunc) selectFunc(that.date);
        that.targetElements = EL.exchangeClass(targetElements, chooseItem, el, ['focus']);
      } else if(config.type === 'range') {
        if(!firstItem) {
          // 清除已经focus的
          EL.clear(el, range);
          that.firstItem = chooseItem;
          that.targetElements = EL.exchangeClass(targetElements, chooseItem, el, ['active']);
          chooseItem = getEBA(el, 'date', that.firstItem);
          that.rangeElements = [chooseItem, [], chooseItem];
        } else {
          that.range = moment(firstItem).isBefore(chooseItem) ? moment.range([firstItem, chooseItem]) : moment.range([chooseItem, firstItem]);
          // 更换样式
          EL.exChange(rangeElements);
          if(selectFunc) selectFunc(that.range);
          that.firstItem = null;
        }
      } else if(config.type === 'terminal') {
        // 清除已经focus的
        if(range) {
          EL.clear(el, range);
        }
        that.range = moment.range([chooseItem, firstItem || chooseItem]);
        // 更换样式
        EL.exChange(rangeElements);
        if(selectFunc) selectFunc(that.range);
      }
    }
  },
  hover: {
    'drp-day-number'(target, that) {
      var {range, config, rangeElements, el, firstItem, targetElements, interval} = that;
      var {maxDate, minDate} = config;
      var hoverItem = getter.getDate(target);

      if(maxDate) {
        var max = interval ? moment(maxDate).subtract(interval, 'days') : moment(maxDate);
        if(moment(hoverItem).isAfter(max)) hoverItem = getter.format(max);
      }
      
      if(minDate && moment(hoverItem).isBefore(minDate)) {
        hoverItem = getter.format(moment(minDate));
      }



      var chooseMoment = interval ? moment(hoverItem).add(interval, 'days') : moment(hoverItem);

      if(!el) return;
      getEBA(el, 'date', hoverItem).forEach((item) => {
        if(item !== target) {
          item.classList.add('hover');
          target.addEventListener('mouseout', () => {
            item.classList.remove('hover');
          });
        }
      });
      if(config.type === 'range' && firstItem) {
        if(moment(firstItem).isBefore(hoverItem)) {
          that.rangeElements = EL.choose(rangeElements, firstItem, hoverItem, el, firstItem);
        } else {
          that.rangeElements = EL.choose(rangeElements, hoverItem, firstItem, el, firstItem);
        }
      }
      if(config.type === 'terminal') {
        that.firstItem = getter.format(chooseMoment);
        that.rangeElements = EL.choose(rangeElements, hoverItem, that.firstItem, el, that.firstItem);
      }
    }
  },
  leave(that) {
    var {config, rangeElements, targetElements} = that;
    if(config.type === 'range' || config.type === 'terminal') {
      // 清除active的元素
      EL.clearRange(rangeElements, targetElements);
      that.rangeElements = [[], [], []];
      that.targetElements = [];
      that.firstItem = null;
    }
  }
};

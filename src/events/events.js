const PubSub = require('expubsub');
const getEBA = require('./../tools/getElementsByAttribute');
const CB = require('./../tools/cssbundle');
const EL = require('./../tools/element');
const getter = require('./../tools/getter');

module.exports = {
  reload(that) {
    var {range, config, rangeElements, interval, el, firstItem} = that;
    if(!range) that.range = config.range;
    if(!interval && config.type === 'terminal') {
      that.interval = that.range.diff('days');
    }
    that.rangeElements = EL.choose(rangeElements, getter.format(that.range.start), getter.format(that.range.end), el, firstItem);
  },
  click: {
    'drp-day-number'(target, that) {
      var {range, config, rangeElements, el, firstItem, targetElements, interval} = that;
      var selectFunc = config.onSelect;
      // 直接返回这个时间的moment对象并设置class
      var chooseItem = getter.getDate(target);
      if(config.type === 'single') {
        if(selectFunc) selectFunc(moment(chooseItem));
        that.targetElements = EL.exchangeClass(targetElements, target, el, 'focus');
      } else if(config.type === 'range') {
        if(!firstItem) {
          // 清除已经focus的
          if(range) {
            EL.clear(el, range);
          }
          that.range = null;
          that.firstItem = chooseItem;
          chooseItem = getEBA(target, 'date', firstItem);
          that.rangeElements = [chooseItem, [], chooseItem];
          that.targetElements = EL.exchangeClass(targetElements, target, el, 'active');
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
        that.range = moment.range([chooseItem, firstItem]);
        // 更换样式
        EL.exChange(rangeElements);
        if(selectFunc) selectFunc(that.range);
        that.firstItem = null;
      }
    }
  },
  hover: {
    'drp-day-number'(target, that) {
      var {range, config, rangeElements, el, firstItem, targetElements, interval} = that;
      var hoverItem = getter.getDate(target);
      if(!el) return;
      getEBA(el, 'date', hoverItem).forEach((item) => {
        if(item !== target) {
          CB.addClass(item, 'hover');
          target.addEventListener('mouseout', () => {
            CB.removeClass(item, 'hover');
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
        that.firstItem = getter.format(moment(hoverItem).add(interval, 'days'));
        that.rangeElements = EL.choose(rangeElements, hoverItem, that.firstItem, el, that.firstItem);
      }
    }
  }
};

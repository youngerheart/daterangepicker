const PubSub = require('expubsub');
const getEBA = require('./../tools/getElementsByAttribute');
const cb = require('./../tools/cssbundle');

const getDate = (el) => {
  return el.getAttribute('date');
};

const getConfig = () => {
  return PubSub.get('config');
};

const isType = (str) => {
  return getConfig().type === str;
};

var startElements = [];
var segmentElements = [];
var endElements = [];
var firstItem = null;
var range = [];

const changeElement = (oldArr, newArr, className) => {
  oldArr.forEach((item) => {
    if(newArr.indexOf(item) === -1) {
      cb.removeClass(item, className);
    }
  });
  newArr.forEach((item) => {
    cb.addClass(item, className);
  });
  return newArr;
};

const changeClass = (startItem, endItem, target) => {
  var newStartElements = [];
  var newSegmentElements = [];
  var newEndElements = [];
  var range = moment.range(startItem, endItem);
  range.by('days', (moment) => {
    var arr = getEBA(target, 'date', moment.format('YYYY-MM-DD'));
    if(moment.isAfter(startItem)) {
      if(moment.isBefore(endItem)) {
        // 这里是过程
        newSegmentElements = newSegmentElements.concat(arr);
      } else {
        // 这里是结束
        newEndElements = newEndElements.concat(arr);
      }
    } else {
      // 这里是start
      newStartElements = newStartElements.concat(arr);
    }
  });
  // 去除老的，增加新的，最后赋值
  startElements = changeElement(startElements, newStartElements, 'active start');
  endElements = changeElement(endElements, newEndElements, 'active end');
  segmentElements = changeElement(segmentElements, newSegmentElements, 'active segment');
};

const exchangeClass = (el, target, className) => {
  className = className || '';
  startElements.forEach((oldEl) => {
    if(oldEl === el) return;
    if(oldEl) cb.removeClass(oldEl, className);
  });
  if(!cb.hasClass(el, className)) {
    startElements = [];
    getEBA(target, 'date', getDate(el)).forEach((item) => {
      cb.addClass(item, className);
      startElements.push(item);
    });
    PubSub.set('startElements', startElements);
  }
};

module.exports = {
  click: {
    target: null,
    'drp-day-number'(el) {
      if(isType('single')) {
        // 直接返回这个时间的moment对象并设置class
        var dateStr = getDate(el);
        var selectFunc = getConfig().onSelect;
        if(selectFunc) selectFunc(moment(dateStr));
        exchangeClass(el, this.target, 'focus');
      } else if(isType('range')) {
        if(!firstItem) {
          firstItem = getDate(el);
          exchangeClass(el, this.target, 'active');
        } else {
          var chooseItem = getDate(el);
          range = moment(firstItem).isBefore(chooseItem) ? [firstItem, chooseItem] : [chooseItem, firstChoose];
          firstItem = null;
        }
      }
    }
  },
  hover: {
    target: null,
    'drp-day-number'(el) {
      if(!this.target) return;
      getEBA(this.target, 'date', getDate(el)).forEach((item) => {
        if(item !== el) {
          cb.addClass(el, 'hover');
          el.addEventListener('mouseout', () => {
            cb.removeClass(el, 'hover');
          });
        }
      });
      if(isType('range') && firstItem) {
        var hoverItem = getDate(el);
        if(moment(firstItem).isBefore(hoverItem)) {
          changeClass(firstItem, hoverItem, this.target);
        } else if(moment(hoverItem).isBefore(firstItem)) {
          changeClass(hoverItem, firstItem, this.target);
        } else {
          // 清除其他class
          cb.removeClass('start segment end');
        }
      }
    }
  }
};

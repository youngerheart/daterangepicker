const PubSub = require('expubsub');
const getEBA = require('./../tools/getElementsByAttribute');
const CB = require('./../tools/cssbundle');
const EL = require('./../tools/element');

const getDate = (el) => {
  return el.getAttribute('date');
};

const getConfig = () => {
  return PubSub.get('config');
};

const isType = (str) => {
  return getConfig().type === str;
};

var targetElements = [];
var rangeElements = [[], [], []];
var firstItem = null;
var classArr = ['start', 'segment', 'end'];
var range = {};

PubSub.on('monthChange', (target) => {
  if(range.start) {
    changeClass(range.start.format('YYYY-MM-DD'), range.end.format('YYYY-MM-DD'), target);
  }
});

const classFunc = (i) => {
  return (firstItem ? 'active ' : 'focus ') + classArr[i];
};

const exChangeElement = () => {
  var name = '';
  rangeElements.forEach((els) => {
    els.forEach((item) => {
      name = item.className.replace('active', 'focus');
      item.className = name;
    });
  });
};

const changeClass = (startItem, endItem, target) => {
  var newStartEls = [];
  var newSegmentEls = [];
  var newEndEls = [];
  var thatRange = moment.range(startItem, endItem);
  thatRange.by('days', (moment) => {
    var arr = getEBA(target, 'date', moment.format('YYYY-MM-DD'));
    if(moment.isAfter(startItem)) {
      if(moment.isBefore(endItem)) {
        // 这里是过程
        newSegmentEls = newSegmentEls.concat(arr);
      } else {
        // 这里是结束
        newEndEls = newEndEls.concat(arr);
      }
    } else {
      // 这里是start
      newStartEls = newStartEls.concat(arr);
    }
  });
  if(!newStartEls.length) {
    newStartEls = newEndEls;
  } else if(!newEndEls.length) {
    newEndEls = newStartEls;
  }
  // 去除老的，增加新的，最后赋值
  var newRangeElements = [newStartEls, newSegmentEls, newEndEls];
  rangeElements = EL.change(rangeElements, newRangeElements, classFunc);
  // 如果起始重合
  if(newStartEls[0] === newEndEls[0]) {
    newStartEls.forEach((item) => {
      CB.removeClass(item, 'start end segment')
    });
  }
};

const exchangeClass = (el, target, className) => {
  className = className || '';
  targetElements.forEach((oldEl) => {
    if(oldEl === el) return;
    if(oldEl) CB.removeClass(oldEl, className);
  });
  if(!CB.hasClass(el, className)) {
    targetElements = [];
    getEBA(target, 'date', getDate(el)).forEach((item) => {
      CB.addClass(item, className);
      targetElements.push(item);
    });
    PubSub.set('targetElements', targetElements);
  }
};

module.exports = {
  click: {
    target: null,
    'drp-day-number'(el) {
      var selectFunc = getConfig().onSelect;
      if(isType('single')) {
        // 直接返回这个时间的moment对象并设置class
        var dateStr = getDate(el);
        if(selectFunc) selectFunc(moment(dateStr));
        exchangeClass(el, this.target, 'focus');
      } else if(isType('range')) {
        if(!firstItem) {
          // 清除已经focus的
          if(range.start) {
            range.by('days', (moment) => {
              getEBA(this.target, 'date', moment.format('YYYY-MM-DD')).forEach((item) => {
                CB.removeClass(item, 'focus start end segment');
              });
            });
          }
          range = {};
          rangeElements = [[], [], []];
          firstItem = getDate(el);
          exchangeClass(el, this.target, 'active');
        } else if(isType('range')) {
          var chooseItem = getDate(el);
          range = moment(firstItem).isBefore(chooseItem) ? moment.range([firstItem, chooseItem]) : moment().range([chooseItem, firstItem]);
          // 更换样式
          exChangeElement();
          if(selectFunc) selectFunc(range);
          firstItem = null;
        } else if(isType('terminal')) {
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
          CB.addClass(item, 'hover');
          el.addEventListener('mouseout', () => {
            CB.removeClass(item, 'hover');
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
          changeClass(firstItem, hoverItem, this.target);
        }
      }
    }
  }
};

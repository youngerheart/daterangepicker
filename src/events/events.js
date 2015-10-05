const PubSub = require('expubsub');
const getEBA = require('./../tools/getElementsByAttribute');
const CB = require('./../tools/cssbundle');
const EL = require('./../tools/element');
const getter = require('./../tools/getter');

var targetElements = []; // single时储存的点击元素
var rangeElements = [[], [], []]; // range，terminal时储存的元素
var firstItem = null;
var range = null;
var interval = null;

PubSub.on('reload', (target) => {
  if(!range) range = getter.config('range');
  if(!interval && getter.isType('terminal')) {
    interval = range.diff('days');
  }
  rangeElements = EL.choose(rangeElements, getter.format(range.start), getter.format(range.end), target, firstItem);
});

const exChangeElement = () => {
  var name = '';
  rangeElements.forEach((els) => {
    els.forEach((item) => {
      name = item.className.replace('active', 'focus');
      item.className = name;
    });
  });
};

const exchangeClass = (el, target, className) => {
  className = className || '';
  targetElements.forEach((oldEl) => {
    if(oldEl === el) return;
    if(oldEl) CB.removeClass(oldEl, className);
  });
  if(!CB.hasClass(el, className)) {
    targetElements = [];
    getEBA(target, 'date', getter.getDate(el)).forEach((item) => {
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
      var selectFunc = getter.config('onSelect');
      // 直接返回这个时间的moment对象并设置class
      var chooseItem = getter.getDate(el);
      if(getter.isType('single')) {
        if(selectFunc) selectFunc(moment(chooseItem));
        exchangeClass(el, this.target, 'focus');
      } else if(getter.isType('range')) {
        if(!firstItem) {
          // 清除已经focus的
          if(range) {
            EL.clear(this.target, range);
          }
          range = null
          rangeElements = [[], [], []];
          firstItem = chooseItem;
          exchangeClass(el, this.target, 'active');
        } else {
          range = moment(firstItem).isBefore(chooseItem) ? moment.range([firstItem, chooseItem]) : moment.range([chooseItem, firstItem]);
          // 更换样式
          exChangeElement();
          if(selectFunc) selectFunc(range);
          firstItem = null;
        }
      } else if(getter.isType('terminal')) {
        // 清除已经focus的
        if(range) {
          EL.clear(this.target, range);
        }
        range = moment.range([chooseItem, firstItem]);
        // 更换样式
        exChangeElement();
        if(selectFunc) selectFunc(range);
        firstItem = null;
      }
    }
  },
  hover: {
    target: null,
    'drp-day-number'(el) {
      var hoverItem = getter.getDate(el);
      if(!this.target) return;
      getEBA(this.target, 'date', hoverItem).forEach((item) => {
        if(item !== el) {
          CB.addClass(item, 'hover');
          el.addEventListener('mouseout', () => {
            CB.removeClass(item, 'hover');
          });
        }
      });
      if(getter.isType('range') && firstItem) {
        if(moment(firstItem).isBefore(hoverItem)) {
          rangeElements = EL.choose(rangeElements, firstItem, hoverItem, this.target, firstItem);
        } else {
          rangeElements = EL.choose(rangeElements, hoverItem, firstItem, this.target, firstItem);
        }
      }
      if(getter.isType('terminal')) {
        firstItem = getter.format(moment(hoverItem).add(interval, 'days'));
        rangeElements = EL.choose(rangeElements, hoverItem, firstItem, this.target, firstItem);
      }
    }
  }
};

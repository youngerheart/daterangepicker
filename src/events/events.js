const PubSub = require('./../tools/pubsub');
const getEBA = require('./../tools/getElementsByAttribute');

const getDate = (el) => {
  return el.getAttribute('date');
};

const getConfig = () => {
  return PubSub.get('config');
};

const isType = (str) => {
  return getConfig().type === str;
};

const focusStr = 'focus';
const hoverStr = 'hover';

var focusElements = [];
var firstItem = null;
var range = [];

const hasClass = (el, className) => {
  return el.className.indexOf(className) !== -1
};

const addClass = (el, className) => {
  if(hasClass(el, className)) return;
  el.className += (' ' + className);
};

const removeClass = (el, className) => {
  if(!hasClass(el, className)) return;
  el.className = el.className.replace(className, '')
};

const changeClass = (className) => {
  focusElements.forEach((item) => {
    ['start', 'end', 'segment'].forEach((name) => {
      if(name === className) {
        addClass(item, name);
      } else {
        removeClass(item, name);
      }
    });
  })
};

const exchangeClass = (el, target) => {
  focusElements.forEach((oldEl) => {
    if(oldEl === el) return;
    if(oldEl) removeClass(oldEl, focusStr);
  });
  if(el.className.indexOf('focus') === -1) {
    focusElements = [];
    getEBA(target, 'date', getDate(el)).forEach((item) => {
      addClass(item, focusStr);
      focusElements.push(item);
    });
    PubSub.set('focusElements', focusElements);
  }
};

module.exports = {
  click: {
    target: null,
    'drp-day-number': function(el) {
      if(isType('single')) {
        // 直接返回这个时间的moment对象并设置class
        var dateStr = getDate(el);
        var selectFunc = getConfig().onSelect;
        if(selectFunc) selectFunc(moment(dateStr));
        exchangeClass(el, this.target);
      } else if(isType('range')) {
        if(!firstItem) {
          firstItem = getDate(el);
          exchangeClass(el, this.target);
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
    'drp-day-number': function(el) {
      if(!this.target) return;
      getEBA(this.target, 'date', getDate(el)).forEach((item) => {
        if(item !== el) {
          addClass(el, hoverStr);
          el.addEventListener('mouseout', () => {
            removeClass(el, hoverStr);
          });
        }
      });
      if(isType('range') && firstItem) {
        var hoverItem = getDate(el);
        if(moment(firstItem).isBefore(hoverItem)) {
          changeClass('start');
        } else if(moment(hoverItem).isBefore(firstItem)) {
          changeClass('end');
        } else {
          changeClass();
        }
      }
    }
  }
};

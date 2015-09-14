const PubSub = require('./../tools/pubsub');
const getElementsByAttribute = require('./../tools/getElementsByAttribute');

const getDate = (el) => {
  return el.getAttribute('date');
};

const getConfig = () => {
  return PubSub.get('config');
};

const isType = (str) => {
  return getConfig().type === str;
};

const focusStr = ' focus';
const hoverStr = ' hover';

const exchangeClass = (el, target) => {
  PubSub.get('focusElements').forEach((oldEl) => {
    if(oldEl === el) return;
    if(oldEl) oldEl.className = oldEl.className.replace(focusStr, '');
  });
  if(el.className.indexOf('focus') === -1) {
    var focusElements = [];
    getElementsByAttribute(target, 'date', getDate(el)).forEach((item) => {
      item.className += focusStr;
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
      }
    }
  },
  hover: {
    target: null,
    'drp-day-number': function(el) {
      if(!this.target) return;
      getElementsByAttribute(this.target, 'date', getDate(el)).forEach((item) => {
        if(item !== el) {
          item.className += hoverStr;
          el.addEventListener('mouseout', () => {
            item.className = item.className.replace(hoverStr, '');
          });
        }
      });
    }
  }
};

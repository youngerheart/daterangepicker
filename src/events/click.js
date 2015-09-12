const PubSub = require('./../tools/pubsub');

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

const exchangeClass = (el, type) => {
  if(!type) {
    var oldEl = PubSub.get('focusElements')[0];
    if(oldEl === el) return;
    if(oldEl) oldEl.className = oldEl.className.replace(focusStr, '');
    PubSub.set('focusElements', [el]);
  }
  if(el.className.indexOf('focus') === -1) {
    el.className += focusStr;
  }
};

module.exports = {
  'drp-day-number': function(el) {
    if(isType('single')) {
      // 直接返回这个时间的moment对象并设置class
      var selectFunc = getConfig().onSelect;
      if(selectFunc) selectFunc(moment(getDate(el)));

      exchangeClass(el, 0);
    }
  }
};

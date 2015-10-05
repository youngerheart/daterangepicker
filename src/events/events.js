const PubSub = require('expubsub');
const getEBA = require('./../tools/getElementsByAttribute');
const CB = require('./../tools/cssbundle');
const EL = require('./../tools/element');

const getDate = (el) => {
  return el.getAttribute('date');
};

const getConfig = (key) => {
  return PubSub.get('config')[key];
};

const isType = (str) => {
  return getConfig('type') === str;
};

var targetElements = []; // single时储存的点击元素
var rangeElements = [[], [], []]; // range，terminal时储存的元素
var firstItem = null;
var classArr = ['start', 'segment', 'end'];
var range = null;
var interval = null;

const classFunc = (i) => {
  return (firstItem ? 'active ' : 'focus ') + classArr[i];
};


PubSub.on('reload', (target) => {
  if(!range) range = getConfig('range');
  if(!interval && isType('terminal')) {
    interval = range.diff('days');
  }
  rangeElements = EL.choose(rangeElements, range.start.format('YYYY-MM-DD'), range.end.format('YYYY-MM-DD'), target, classFunc);
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
      var selectFunc = getConfig('onSelect');
      // 直接返回这个时间的moment对象并设置class
      var chooseItem = getDate(el);
      if(isType('single')) {
        if(selectFunc) selectFunc(moment(chooseItem));
        exchangeClass(el, this.target, 'focus');
      } else if(isType('range')) {
        if(!firstItem) {
          // 清除已经focus的
          if(range) {
            range.by('days', (moment) => {
              getEBA(this.target, 'date', moment.format('YYYY-MM-DD')).forEach((item) => {
                CB.removeClass(item, 'focus start end segment');
              });
            });
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
      } else if(isType('terminal')) {
        // 清除已经focus的
        if(range) {
          range.by('days', (moment) => {
            getEBA(this.target, 'date', moment.format('YYYY-MM-DD')).forEach((item) => {
              CB.removeClass(item, 'focus start end segment');
            });
          });
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
      var hoverItem = getDate(el);
      if(!this.target) return;
      getEBA(this.target, 'date', hoverItem).forEach((item) => {
        if(item !== el) {
          CB.addClass(item, 'hover');
          el.addEventListener('mouseout', () => {
            CB.removeClass(item, 'hover');
          });
        }
      });
      if(isType('range') && firstItem) {
        if(moment(firstItem).isBefore(hoverItem)) {
          rangeElements = EL.choose(rangeElements, firstItem, hoverItem, this.target, classFunc);
        } else {
          rangeElements = EL.choose(rangeElements, hoverItem, firstItem, this.target, classFunc);
        }
      }
      if(isType('terminal')) {
        firstItem = moment(hoverItem).add(interval, 'days').format('YYYY-MM-DD');
        rangeElements = EL.choose(rangeElements, hoverItem, firstItem, this.target, classFunc);
      }
    }
  }
};

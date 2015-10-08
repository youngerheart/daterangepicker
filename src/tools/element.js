const CB = require('./cssbundle');
const getEBA = require('./getElementsByAttribute');
const {classArr, classFunc, format, getDate} = require('./getter');

module.exports = {
  create(tagName, className, innerText) {
    var element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (innerText) {
      element.innderText = element.textContent = innerText;
    }
    return element;
  },

  choose(rangeElements, startItem, endItem, target, firstItem) {
    var newStartEls = [];
    var newSegmentEls = [];
    var newEndEls = [];
    var thatRange = moment.range(startItem, endItem);
    thatRange.by('days', (moment) => {
      var arr = getEBA(target, 'date', format(moment));
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
    // 去除老的，增加新的，最后赋值
    var newRangeElements = [newStartEls, newSegmentEls, newEndEls];
    rangeElements = this.change(rangeElements, newRangeElements, firstItem);
    // 如果起始重合
    if(newStartEls[0] === newEndEls[0]) {
      newStartEls.forEach((item) => {
        CB.removeClass(item, 'start end segment')
      });
    }
    return rangeElements;
  },

  change(rangeElements, newRangeElements, firstItem) {
    // 全部清除
    rangeElements.forEach((els, i) => {
      els.forEach((item) => {
        if(newRangeElements[i].indexOf(item) === -1) CB.removeClass(item, classFunc(firstItem, classArr[i]));
      });
    });
    // 全部增加
    newRangeElements.forEach((els, i) => {
      els.forEach((item) => {
        if(rangeElements[i].indexOf(item) === -1 || rangeElements[0] === rangeElements[2]) CB.addClass(item, classFunc(firstItem, classArr[i]));
      });
    });
    return newRangeElements;
  },

  clear(target, range){
    var i = null;
    var els = null;
    var momentStr = null;
    range.by('days', (moment) => {
      momentStr = format(moment);
      switch(momentStr) {
        case format(range.start):
          i = 0;
          break;
        case format(range.end):
          i = 2;
          break;
        default:
          i = 1;
          break;
      }
      els = getEBA(target, 'date', momentStr);
      els.forEach((item) => {
        CB.removeClass(item, 'focus ' + classArr[i]);
      });
    });
  },

  exChange(rangeElements) {
    var name = '';
    rangeElements.forEach((els) => {
      els.forEach((item) => {
        name = item.className.replace('active', 'focus').replace('active', '');
        item.className = name;
      });
    });
    return rangeElements;
  },


  exchangeClass(targetElements, date, el, className) {
    className = className || '';
    targetElements.forEach((oldEl) => {
      if(getDate(oldEl) === date) return;
      if(oldEl) CB.removeClass(oldEl, className);
    });
    targetElements = [];
    getEBA(el, 'date', date).forEach((item) => {
      CB.addClass(item, className);
      targetElements.push(item);
    });
    return targetElements;
  }
};

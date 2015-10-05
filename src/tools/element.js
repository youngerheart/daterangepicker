const CB = require('./cssbundle');
const getEBA = require('./getElementsByAttribute');

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

  choose(rangeElements, startItem, endItem, target, classFunc) {
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
    rangeElements = this.change(rangeElements, newRangeElements, classFunc);
    // 如果起始重合
    if(newStartEls[0] === newEndEls[0]) {
      newStartEls.forEach((item) => {
        CB.removeClass(item, 'start end segment')
      });
    }
    return rangeElements;
  },

  change(rangeElements, newRangeElements, classFunc) {
    // 全部清除
    rangeElements.forEach((els, i) => {
      els.forEach((item) => {
        if(newRangeElements[i].indexOf(item) === -1) CB.removeClass(item, classFunc(i));
      });
    });
    // 全部增加
    newRangeElements.forEach((els, i) => {
      els.forEach((item) => {
        if(rangeElements[i].indexOf(item) === -1 || rangeElements[0] === rangeElements[2]) CB.addClass(item, classFunc(i));
      });
    });
    return newRangeElements;
  }
};
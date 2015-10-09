const CB = require('./cssbundle');
const getEBA = require('./getElementsByAttribute');
const {classArr, classFunc, format, getDate} = require('./getter');

module.exports = {
  hasChild(parent, child) {
    var result = false;
    var walk = (node) => {
      if(node === child) {
        result = true;
      }
      if(node.childNodes && node.childNodes.length) {
        walk(node.childNodes[0]);
      }
      if(node.nextSibling) {
        walk(node.nextSibling)
      }
    };
    walk(parent);
    return result;
  },

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

  clearRange(rangeElements, targetElements) {
    var className;
    rangeElements.forEach((els, i) => {
      els.forEach((item) => {
        switch(i) {
          case 0:
            className = 'active start';
            break;
          case 1:
            className = 'active segment';
            break;
          case 2:
            className = 'active end';
            break;
        }
        CB.removeClass(item, className);
      });
    });
    targetElements.forEach((item) => {
      CB.removeClass(item, 'active');
    });
  },

  exChange(rangeElements) {
    var name = '';
    rangeElements.forEach((els) => {
      els.forEach((item) => {
        name = item.className.replace('active', 'focus').replace('active', '').trim();
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

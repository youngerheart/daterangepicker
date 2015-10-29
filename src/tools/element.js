const getEBA = require('./getElementsByAttribute');
const {classArr, classFunc, format, getDate} = require('./getter');

const containsAll = (el, classNameArr) => {
  var pass = true;
  classNameArr.forEach((className) => {
    if(!el.classList.contains(className)) pass = false;
  });
  return pass;
};

const removeAll = (el, classNameArr) => {
  var list = el.classList;
  if(containsAll(el, classNameArr)) {
    var nameArr = el.className.split(' ');
    classNameArr.forEach((item) => {
      let index = nameArr.indexOf(item);
      if(index !== -1) nameArr.splice(index, 1);
    });
    if(nameArr.length === 2) {
      list.remove('active');
    } else{
      list.remove(...classNameArr);
    } 
  }
};

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
        walk(node.nextSibling);
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
          newSegmentEls.push(...arr);
        } else {
          // 这里是结束
          newEndEls.push(...arr);
        }
      } else {
        // 这里是start
        newStartEls.push(...arr);
      }
    });
    // 去除老的，增加新的，最后赋值
    var newRangeElements = [newStartEls, newSegmentEls, newEndEls];
    rangeElements = this.change(rangeElements, newRangeElements, firstItem);
    // 如果起始重合
    if(newStartEls[0] === newEndEls[0]) {
      newStartEls.forEach((item) => {
        item.classList.add('start', 'end', 'segment');
      });
    }
    return rangeElements;
  },

  change(rangeElements, newRangeElements, firstItem) {
    var className = null;
    // 全部清除
    rangeElements.forEach((els, i) => {
      className = classFunc(firstItem, classArr[i]).split(' ');
      els.forEach((item) => {
        removeAll(item, className);
      });
    });
    // 全部增加
    newRangeElements.forEach((els, i) => {
      className = classFunc(firstItem, classArr[i]).split(' ');
      els.forEach((item) => {
        if(!containsAll(item, className) || rangeElements[0] === rangeElements[2]) {
          item.classList.add(...className);
        }
      });
    });
    return newRangeElements;
  },

  clear(el, range){
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
      els = getEBA(el, 'date', momentStr);
      els.forEach((item) => {
        item.classList.remove('focus', classArr[i]);
      });
    });
  },

  clearRange(rangeElements, targetElements) {
    var className;
    rangeElements.forEach((els, i) => {
      els.forEach((item) => {
        switch(i) {
          case 0:
            className = ['active', 'start'];
            break;
          case 1:
            className = ['active', 'segment'];
            break;
          case 2:
            className = ['active', 'end'];
            break;
        }
        removeAll(item, className);
      });
    });
    targetElements.forEach((item) => {
      removeAll(item, ['active']);
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
      if(oldEl) removeAll(oldEl, className);
    });
    targetElements = [];
    getEBA(el, 'date', date).forEach((item) => {
      item.classList.add(className);
      targetElements.push(item);
    });
    return targetElements;
  }
};

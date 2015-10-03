const CB = require('./cssbundle');

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
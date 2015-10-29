const hasChild = require('./element').hasChild;

var targetBox = null;
var itemArr = [];

document.body.addEventListener('mouseover', (e) => {
  if(targetBox && !hasChild(targetBox, e.target)) {
    itemArr.forEach((item) => {
      if(targetBox === item.el) {
        item.callback();
      }
    });
    targetBox = null;
  }
});

module.exports = {
  add(el, callback) {
    itemArr.push({
      el: el,
      callback: callback
    });
  },
  getTarget() {
    return targetBox;
  },
  setTarget(target) {
    targetBox = target;
  }
};

module.exports = {
  hasClass(el, className) {
    return el.className.indexOf(className) !== -1
  },

  addClass(el, className) {
    var classArr = className.split(' ');
    classArr.forEach((item) => {
      if(!this.hasClass(el, item)) el.className += (' ' + item);
    });
    console.log(classArr, el.className);
  },

  removeClass(el, className) {
    var classArr = className.split(' ');
    console.log(classArr, el.className);
    classArr.forEach((item) => {
      if(this.hasClass(el, className)) el.className = el.className.replace(className, '').trim();
    });
    console.log(el.className);
  }
};
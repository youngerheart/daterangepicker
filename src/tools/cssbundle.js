module.exports = {
  hasClass(el, className) {
    return el.className.indexOf(className) !== -1
  },

  addClass(el, className) {
    var oldname = el.className;
    var classArr = className.split(' ');
    classArr.forEach((item) => {
      if(!this.hasClass(el, item)) {
        oldname += (' ' + item);
      }
    });
    el.className = oldname;
  },

  removeClass(el, className) {
    var oldname = el.className;
    var classArr = className.split(' ');
    classArr.forEach((item) => {
      if(this.hasClass(el, item)) oldname = oldname.replace(item, '').trim();
    });
    el.className = oldname;
  }
};
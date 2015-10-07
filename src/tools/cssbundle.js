module.exports = {
  hasClass(el, className) {
    var classArr = className.split(' ');
    var pass = true;
    classArr.forEach((item) => {
      if(el.className.indexOf(item) === -1) pass = false;
    });
    return pass;
  },

  addClass(el, className) {
    var oldname = el.className;
    var classArr = className.split(' ');
    if(!this.hasClass(el, className)) {
      classArr.forEach((item) => {
        oldname += (' ' + item);
      });
      el.className = oldname;
    }
  },

  removeClass(el, className) {
    var oldname = el.className;
    var classArr = className.split(' ');
    if(this.hasClass(el, className)) {
      classArr.forEach((item) => {
        oldname = oldname.replace(item, '').trim();
      });
      el.className = oldname;
    }
  }
};
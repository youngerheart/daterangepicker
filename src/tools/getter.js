const PubSub = require('expubsub');

module.exports = {
  classArr: ['start', 'segment', 'end'],

  getDate(el) {
    return el.getAttribute('date');
  },

  config(key) {
    return PubSub.get('config')[key];
  },

  isType(str) {
    return this.config('type') === str;
  },

  format(moment) {
    return moment.format('YYYY-MM-DD');
  },

  classFunc(firstItem, classStr) {
    return (firstItem ? 'active ' : 'focus ') + classStr;
  }
};
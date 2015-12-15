module.exports = function(e, events, that) {
  e.target.className.split(' ').forEach(function(item) {
    if(typeof events[item] === 'function') {
      events[item](e.target, that);
    }
  });
};

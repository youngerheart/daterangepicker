// 查找指定元素中含有某个属性的项
let getElementsByAttribute = (el, attr, value) => {
  return Array.prototype.slice.call(el.querySelectorAll('[' + attr + '=\'' + value + '\']'));
};

module.exports = getElementsByAttribute;
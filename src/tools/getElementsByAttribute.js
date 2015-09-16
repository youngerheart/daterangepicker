// 遍历选定的dom
let walk = (node, func) => {
  func(node);
  node = node.firstChild;
  while(node) {
    walk(node, func);
    node = node.nextSibling;
  }
};

// 查找指定元素中含有某个属性的项
let getElementsByAttribute = (el, attr, value) => {
  let results = [];
  walk(el, (node) => {
    let actual = node.nodeType === 1 && node.getAttribute(attr);
    if (typeof actual === 'string' && (actual === value || typeof value !== 'string')) {
      results.push(node);
    }
  });
  return results;
};

module.exports = getElementsByAttribute;
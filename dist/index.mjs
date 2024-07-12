const intersectKeys = (_a, _b) => {
  let ai = 0;
  let bi = 0;
  const result = [];
  const a = Object.keys(_a).sort();
  const b = Object.keys(_b).sort();
  while (ai < a.length && bi < b.length) {
    if (a[ai] < b[bi]) {
      ai++;
    } else if (a[ai] > b[bi]) {
      bi++;
    } else {
      result.push(a[ai]);
      ai++;
      bi++;
    }
  }
  return result;
};

function lowercaseEntities(string) {
  return String(string).replace(/&[A-Z]+;/g, (match) => match.toLowerCase());
}
function processContent(options, content, attribute, attributeValue) {
  if (Array.isArray(content)) {
    return Promise.all(content.map((childContent) => processContent(options, childContent, attribute, attributeValue)));
  }
  if (typeof content === "object" && content !== null) {
    if (content.content) {
      return Promise.resolve(processContent(options, content.content, attribute, attributeValue)).then((updatedContent) => {
        content.content = updatedContent;
        return content;
      });
    }
    return Promise.resolve(content);
  }
  if (typeof options[attribute] === "function") {
    return Promise.resolve(options[attribute](String(content), attributeValue)).then((content2) => lowercaseEntities(content2));
  }
  return Promise.resolve(content);
}
function walk(options, node) {
  if (node.attrs) {
    const opt = intersectKeys(options, node.attrs)[0];
    if (opt !== void 0) {
      const attribute = opt;
      const attributeValue = node.attrs[attribute];
      delete node.attrs[attribute];
      return processContent(options, node.content, attribute, attributeValue).then((result) => {
        node.content = result;
        return node;
      });
    }
  }
  if (Array.isArray(node.content)) {
    return Promise.all(node.content.map((childNode) => walk(options, childNode))).then((updatedContent) => {
      node.content = updatedContent;
      return node;
    });
  }
  return Promise.resolve(node);
}
const plugin = (options) => {
  return (nodes) => {
    return Promise.all(nodes.map((node) => walk(options, node))).then((updatedNodes) => updatedNodes);
  };
};

export { plugin as default };

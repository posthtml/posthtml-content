const intersectKeys = require('./intersect-keys.js');

function lowercaseEntities(string) {
  return String(string).replace(/&[A-Z]+;/g, match => match.toLowerCase());
}

function processContent(options, content, attribute, attributeValue) {
  // If content is an array, recursively process each item
  if (Array.isArray(content)) {
    return Promise.all(content.map(childContent => processContent(options, childContent, attribute, attributeValue)));
  }

  if (typeof content === 'object' && content !== null) {
    // If content is an object with nested nodes, process its nested nodes
    if (content.content) {
      return Promise.resolve(processContent(options, content.content, attribute, attributeValue))
        .then(updatedContent => {
          // Update the object's content property after promises are resolved
          content.content = updatedContent;
          return content;
        });
    }

    // Return content unchanged
    return Promise.resolve(content);
  }

  if (typeof options[attribute] === 'function') {
    // If content is a string and options[attribute] is a function, apply the function
    // Lowercase HTML entities in case they were uppercased
    return Promise
      .resolve(options[attribute](String(content), attributeValue))
      .then(content => lowercaseEntities(content));
  }

  // If options[attribute] is not a function, return the content unchanged
  return Promise.resolve(content);
}

function walk(options, node) {
  // Only look for tags with attributes
  if (node.attrs) {
    // Get the first attribute name matching any of the keys in the user config
    const opt = intersectKeys(options, node.attrs)[0];

    if (opt !== undefined) {
      const attribute = opt;
      const attributeValue = node.attrs[attribute];
      // If it does, remove the attribute from the tag, it's just a marker
      delete node.attrs[attribute];

      // Now process the content based on its type (string, array of nodes, or object)
      return processContent(options, node.content, attribute, attributeValue)
        .then(result => {
          // Update the node content after promises are resolved
          node.content = result;
          return node;
        });
    }
  }

  // Now we recurse through the nested content if content exists
  if (Array.isArray(node.content)) {
    return Promise.all(node.content.map(childNode => walk(options, childNode)))
      .then(updatedContent => {
        // Update the node content after promises are resolved
        node.content = updatedContent;
        return node;
      });
  }

  return Promise.resolve(node);
}

// Options passed in by the user
module.exports = options => {
  // Nodes passed from PostHTML
  return nodes => {
    return Promise.all(nodes.map(node => walk(options, node)))
      .then(updatedNodes => updatedNodes);
  };
};

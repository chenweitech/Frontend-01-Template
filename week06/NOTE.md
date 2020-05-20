# 每周总结可以写在这里

## 有限状态机

- 每一个状态都是一个机器
- 所有的这些机器接受的输入是一致的
- 状态机的每一个机器本身没有状态，如果我们用函数表示那应该是一个纯函数
- 每一个机器知道下一个状态
- 每个机器都有确定的下一个状态（Moore）
- 每个机器根据输入决定下一个状态（Mealy)

## DOM 树构建

```js
let currentToken = null;
let currentAttribute = null;

let stack = [{ type: "document", children: [] }];

function emit(token) {
  if (token.type != "text") {
    return;
  }
  let top = stack[stack.length - 1];

  if (token.type == "startTag") {
    let el = {
      type: "element",
      children: [],
      attributes: [],
    };
    el.tagName = token.tagName;

    for (let p in token) {
      if (p != "type" && p != "tagName") {
        el.attributes.push({
          name: p,
          value: token[p],
        });
      }
    }

    top.children.push(el);
    el.parent = top;

    if (!token.isSelfClosing) {
      stack.push(el);
    }
    currentTextNode = null;
  } else if (token.type == "endTag") {
    if (top.tagName != token.tagName) {
      throw new Error("tag start end does't match");
    } else {
      stack.pop();
    }
    currentTextNode = null;
  }
}

const EOF = Symbol("EOF");
function data(c) {
  if (c == "<") {
    return tagOpen;
  } else if (c == EOF) {
    return emit({
      type: "EOF",
    });
  } else {
    emit({
      type: "text",
      content: c,
    });
    return data;
  }
}

function tagOpen(c) {
  if (c == "!") {
    return markupDeclaration;
  } else if (c == "/") {
    return endTagOpen;
  } else if (c.match(/^[a-xA-Z]$/)) {
    currentToken = {
      type: "startTag",
      tagName: "",
    };
    return tagName(c);
  } else if (c == "?") {
    commentToken = {
      type: "questionMark",
      data: "",
    };
    return BogusComment(c);
  } else if (c == "EOF") {
    emit({
      type: "EOF",
    });
  } else {
    emit({
      type: "text",
      content: c,
    });
    return;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-xA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    };
    return tagName(c);
  } else if (c == ">") {
  } else if (c == "EOF") {
    return emit({
      type: "EOF",
    });
  } else {
    commentToken = {
      type: "questionMark",
      data: "",
    };
    return BogusComment(c);
  }
}
function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAtributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c == ">") {
    emit(currentToken);
    return data;
  } else if (c.match(/^[a-xA-Z]$/)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c == "EOF") {
    emit({
      type: "EOF",
    });
    return data;
  } else {
    currentToken.tagName += c;
    return tagName;
  }
}

function beforeAtributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAtributeName;
  } else if (c == "=") {
  } else if (c == ">" || c == "/" || c == EOF) {
    return afterAttributeName(c);
  } else {
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}

function selfClosingStartTag(c) {
  if (c == ">") {
    currentToken.isSelfClosing = true;
    return data;
  } else if (c == "EOF") {
  } else {
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c == "/" || c == EOF || c == ">") {
    return afterAttributeName(c);
  } else if (c == "=") {
    return beforeAtributeValue;
  } else if (c == "\u0000") {
    currentAttribute.name += "\ufffd";
  } else if (c == '"' || c == "'" || c == "<") {
    currentAttribute.name += c;
    return attributeName;
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c == "=") {
    return beforeAtributeValue;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {
    emit({
      type: "EOF",
    });
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}

function beforeAtributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
    return beforeAtributeValue;
  } else if (c == '"') {
    return doubleQuotedAttributeValue;
  } else if (c == "'") {
    return singleQuotedAttributeValue;
  } else if (c == ">") {
    emit(currentToken);
    return data;
  } else {
    return UnquotedAttibutedValue(c);
  }
}

function doubleQuotedAttributeValue(c) {
  if (c == '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c == "&") {
  } else if (c == "\u0000") {
  } else if (c == EOF) {
    emit({
      type: EOF,
    });
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function singleQuotedAttributeValue(c) {
  if (c == "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c == "&") {
  } else if (c == "\u0000") {
  } else if (c == EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAtributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {
    emit({
      type: EOF,
    });
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function UnquotedAttibutedValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAtributeName;
  } else if (c == "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == "\u0000") {
  } else if (c == "'" || c == '"' || c == "<" || c == "=" || c == "`") {
  } else if (c == EOF) {
  } else {
    currentAttribute.value += c;
    return UnquotedAttibutedValue;
  }
}

function markupDeclaration(c) {}

module.exports.parserHTML = function parserHTML(html) {
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
  console.log(stack[0]);
};
```

# 每周总结&作业

> 学习总结

## 按语法分类

### 非形式语言

- 中文，英文

### 形式语言（乔姆斯基谱系）

- 0-型文法（无限制文法或短语结构文法）? ::= ?

- 1-型文法（上下文相关文法）?\<A>? ::= ?\<B>?

- 2-型文法 (上下文无关文法) \<A> ::= ?

- 3-型文法（正规文法）\* \<A>::=\<A>?

## 产生式（BNF）

- 终结符

- 非终结符

## 图灵完备性

### 命令式——图灵机

- goto

- if 和 while

### 声明式——lambda

- 递归
- 分治

## 类型系统

### 动态与静态类型

- 动态

### 类型系统

- 动态类型系统与静态类型系统

- 强类型与弱类型

- 复合类型

  - 结构体

  - 函数签名

- 子类型

  - 逆变/协变

## Javascript

[Unicode](https://www.fileformat.info/info/unicode/)
[中文字符](https://www.fileformat.info/info/unicode/block/cjk_unified_ideographs/index.htm)

可用 `String.fromCharCode(num)` `'\t'.codePointAt()` 进行打印

### Atom

- Identifier
- Literal

### Expression

- Atom
- Operator
- Punctuator

### Statement

- Expression
- Keyword
- Punctuator

### Structure

- Function
- Class
- Process
- Namespace

### Program

- Program
- Mould
- Package
- Library

> 作业

## 写一个能匹配所有 Number 直接量的正则

```javascript
/^(\d+|(0|[1-9]\d*)\.?\d*?)$|^0[bB][01]+$|^0[oO][0-7]+$|^0[xX][0-9a-fA-F]+$/g;
```

## 写一个 UTF8_Encoding 方法

```javascript
function UTF8_Encoding(str) {
  const code = encodeURIComponent(text);
  const bytes = [];
  for (var i = 0; i < code.length; i++) {
    const c = code.charAt(i);
    if (c === "%") {
      const hex = code.charAt(i + 1) + code.charAt(i + 2);
      const hexVal = parseInt(hex, 16);
      bytes.push(hexVal);
      i += 2;
    } else bytes.push(c.charCodeAt(0));
  }
  return bytes;
}
```

## 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号

```javascript
/^(?:['"\\bfnrtv\n\r\u2028\u2029]|\\x[0-9a-fA-F]{2}|\\u[0-9a-fa-F]{4})*$/;
```

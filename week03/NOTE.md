# 每周总结可以写在这里

> 学习总结

- Function Object

  - \[[Call]]

  - \[[Construct]]

- Array Object

  - \[[DefineOwnProperty]]

- String Object

- Arguments Object

  - \[[Callee]]

- Object

  - \[[Get]]

  - \[[Set]]

  - \[[GetPrototypeOf]]

  - \[[SetPrototypeOf]]

  - \[[GetOwnProperty]]

  - \[[HasProperty]]

  - \[[IsExtensible]]

  - \[[PreventExtensions]]

  - \[[DefineOwnProperty]]

  - \[[Delete]]

  - \[[OwnPropertyKeys]]

    - Object.keys()

    - Object.entries()

    - Object.values()

  - \[[Call]]

- Module Namespece

  - \[[Module]]

  - \[[Exports]]

- Member

- New

- Call

- Update

- Unary

  js
  delete a.b;
  void 0;
  typeof a + a - a;
  ~a;
  !a;
  await a;

* Exponental

* Multiplicative

* Additive

* Shift

* Relationship

* Equality

* Bitwise

* Logical

* Conditional

##### 类型转换

- 基础类型

  - Undefined
  - Boolean
  - String
  - Number
  - Null
  - Symbol
  - BigInt
  - Object

- 装箱&拆箱

  装箱：基础类型 => 包装类型

  拆箱：包装类型(Object) => 基础类型

- 类型的判断

  - typeof
  - Obejct.prototype .toString .call
  - instanceof

- 隐式转换发生的场景

  - Left Handside Right Handside

  - ==

  - if

  - 数学运算符

#### Statement

##### Grammar

- 简单语句

  - ExpressionStatement

  - EmptyStatement

  - DebuggerStatement

  - ThrowStatement

  - ContinueStatement

  - BreakStatement

  - ReturnStatement

- 组合语句

  - BlockStatement

    - \[[type]]
    - \[[value]]
    - \[[target]]

  - IfStatement

  - SwitchStatement

  - LeabelledStatement

  - IterationStatement

  - TryStatement

    - \[[type]]
    - \[[value]]
    - \[[target]]

- Declaration

  - FunctionDeclaration

  - GeneratorDeclaration

  - AsyncFunctionDeclaration

  - AsyncGeneratorDeclaration

  - VariableStatement

  - ClassDeclaration

* LexicalDeclaration

##### Runtime

- Completion Record
  - \[[type]]
  - \[[value]]
  - \[[target]]
- Lexical Enviorment

##### 预处理/变量提升

js
var a = 2;
void (function () {
a = 1;
return;
var a; // const a
})();

##### Object-Class

- 基类
- interface
- mixin

##### Prototype

##### Object in JavaScript

- Property

  - Key
    - Symbol
    - String
  - Value
    - Data Property
      - \[[value]]
      - writable
      - emumerable
      - configurable
    - Accessor Property
      - get
      - set
      - emumerable
      - configurable

- \[[Prototype]]

##### Object API

- {} . [] Object.defineProperty

- Object.create Object.setPrototypeOf Object.getPrototypeOf

- new class extends

- new function prototype

> 作业

#### convertNumberToString

```javascript
function convertNumberToString(number, radix) {
  let integer = Math.floor(number);
  let fraction = String(number).match(/\.\d+$/);
  if (fraction) {
    fraction = fraction[0].replace(".", "");
  }
  let string = "";
  while (integer > 0) {
    string = String(integer % radix) + string;
    integer = Math.floor(integer / radix);
  }
  return fraction ? `${string}.${fraction}` : string;
}
```

#### convertStringToNumber

```javascript
function convertStringToNumber(string, radix = 10) {
  if (radix > 10) {
    return;
  }
  let flag = /e|E/.test(string);
  if (!flag) {
    let chars = string.split("");
    let number = 0;
    let i = 0;
    while (i < chars.length && chars[i] != ".") {
      number = number * radix;
      number += chars[i].codePointAt(0) - "0".codePointAt(0);
      i++;
    }
    if (chars[i] === ".") {
      i++;
    }
    let fraction = 1;
    while (i < chars.length) {
      fraction /= radix;
      number += (chars[i].codePointAt(0) - "0".codePointAt(0)) * fraction;
      i++;
    }
    return number;
  } else {
    let logNumber = Number(string.match(/\d+$/)[0]);
    let number = string.match(/^[\d\.]+/)[0].replace(/\./, "");
    if (/e-|E-/.test(string)) {
      return Number(number.padEnd(logNumber + 1, 0));
    } else {
      return Number(
        number.padStart(logNumber + number.length, 0).replace(/^0/, "0.")
      );
    }
  }
}
```

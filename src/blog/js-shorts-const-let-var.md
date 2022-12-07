---
title: Javascript shorts - const, let and var
published: true
description: 
date: 2022-11-02
---

# Javascript shorts - const, let and var

Javascript has three ways to declare variable. In this article I will make a quick summary and briefly describe all the differences.

```js
const numberA = 5;
let numberB = 5;
var numberC = 5;
```

## Scope

Depending where `var` is declared it can be globally scoped, when declared outside of function, or function scoped otherwise. A function scope means that it can be accessed within the function. A variable declared in a block with `let` or `const` is only available for use within that block.

| Declaration      | Scope |
| ----------- | ----------- |
| const      | block scoped       |
| let   | block scoped        |
| var   | globally or function scoped   |

## Can it be updated?

```javascript
 var user = 'Tommy';
 user = 'John';

 let user2 = 'Tommy';
 user2 = 'John';

 const user3 = 'Tommy';
 user3 = 'John'; // <-- Error
 ```

 A `var` or `let` declared variable can be updated. A `const` declared variable cannot be updated when it is a primitive value. The property of `const` object or value inside the `const` array can be changed but reference must stay the same.

 ```javascript
const obj = {name: 'Tommy'};
obj.age = 30 // <-- OK
obj = {id: 1} // <-- Error
```

 | Declaration      | Can it be updated? |
| ----------- | ----------- |
| const      | No       |
| let   | Yes        |
| var   | Yes  |

## Can it be re-declared?

```javascript
 var user = 'Tommy';
 var user = 'John';

 let user2 = 'Tommy';
 let user2 = 'John'; // <-- Error

 const user3 = 'Tommy';
 const user3 = 'John'; // <-- Error
 ```

Once a `let` or `const` variable is declared it cannot be declared again within the same scope. A `var` declared variable can be re-declared.

 | Declaration      | Can it be re-declared? |
| ----------- | ----------- |
| const      | No   |
| let   | No   |
| var   | Yes  |


## Hoisting

The `var` variables are hoisted to the top of their scope and initialized with a value of `undefined`. It can be declared and accessed without initialization. The `let` declarations are hoisted to the top. Unlike `var`, the `let` keyword is not initialized, it can be declared without initialization but if you try to use it before you set the value, you'll get a `Reference Error`. The `const` variables are hoisted to the top and must be initialized during declaration.

| Declaration      | Can it be declared without initialization? | Can it be accessed without initialization? |
| ----------- | ----------- | ----------- |
| const      | No   | No   |
| let   | Yes   | No   |
| var   | Yes  | Yes   |

## Why you should avoid using var?

Since `var` declared variable can be later re-declared and it is not block scoped it can be very easy to make a simple mistake. Just look at the code below:

```javascript
 var user = 'Tommy';

 if (true) {
    var user = 'John';
 }

 console.log(user) // 'John'
 ```
Even if you declared a variable inside a block you may be aware that this variable has already been declared before. Changes inside code block affects the code outside of it and this may give unexpected results and lots of bugs later during development. This is why you should always use `const` and `let` instead of `var`.
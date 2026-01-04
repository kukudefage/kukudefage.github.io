---
title: JavaScript原型与原型链详解
date: 2025-07-18 18:00:00
tags:
  - JavaScript
  - 原型
  - 原型链
  - 前端基础
  - 面试考点
categories:
  - JavaScript核心
---

# JavaScript原型与原型链详解

原型(Prototype)和原型链(Prototype Chain)是JavaScript实现面向对象编程的核心机制，也是理解继承、对象属性查找的关键。本文将从底层原理到实际应用，全面解析原型系统，并结合面试高频问题帮助开发者彻底掌握这一重要概念。

## 1. 原型的基本概念

### 什么是原型？
在JavaScript中，**每个对象都有一个原型对象**，对象可以从原型继承属性和方法。原型本身也是对象，形成一种链式结构，这就是原型链。

JavaScript通过原型实现继承，而非传统的类继承。ES6引入的`class`语法只是原型继承的语法糖，并未改变底层实现。

### 原型相关的三个属性
1. **`prototype`**：函数特有属性，指向一个对象，该对象将作为通过该构造函数创建的所有实例的原型
2. **`__proto__`**：对象实例的属性，指向其原型对象（非标准但广泛支持，标准方法为`Object.getPrototypeOf()`）
3. **`constructor`**：原型对象的属性，指向关联的构造函数

```javascript
// 构造函数
function Person(name) {
  this.name = name;
}

// 实例对象
const person = new Person('John');

// 原型关系
console.log(person.__proto__ === Person.prototype); // true
console.log(Person.prototype.constructor === Person); // true
console.log(Object.getPrototypeOf(person) === Person.prototype); // true
```

## 2. 原型链的工作机制

### 原型链的形成
当访问对象的属性或方法时，JavaScript会先在对象自身查找，若不存在则沿着`__proto__`链向上查找，直至找到或到达原型链顶端(`null`)。

```javascript
// 原型链结构示例
const obj = {};
console.log(obj.__proto__); // Object.prototype
console.log(obj.__proto__.__proto__); // null

const arr = [];
console.log(arr.__proto__); // Array.prototype
console.log(arr.__proto__.__proto__); // Object.prototype
console.log(arr.__proto__.__proto__.__proto__); // null
```

### 属性查找规则
1. 优先查找对象自身属性（使用`hasOwnProperty()`可判断）
2. 若不存在则沿原型链依次向上查找
3. 直至`Object.prototype`，若仍不存在则返回`undefined`

```javascript
// 属性查找示例
function Animal(type) {
  this.type = type;
}
Animal.prototype.eat = function() {
  console.log('Eating');
};

const cat = new Animal('cat');
cat.name = 'Mimi';

console.log(cat.name); // 'Mimi' (自身属性)
console.log(cat.type); // 'cat' (构造函数定义的属性)
console.log(cat.eat); // 原型方法 (Animal.prototype)
console.log(cat.toString); // Object.prototype方法
console.log(cat.foo); // undefined (原型链中不存在)
```

## 3. 构造函数与原型对象

### 构造函数创建对象
通过构造函数创建的对象，其原型指向构造函数的`prototype`属性：

```javascript
function Car(color) {
  this.color = color;
}

// 向原型添加方法
Car.prototype.drive = function() {
  console.log(`Driving a ${this.color} car`);
};

const redCar = new Car('red');
const blueCar = new Car('blue');

redCar.drive(); // 'Driving a red car'
blueCar.drive(); // 'Driving a blue car'

// 所有实例共享原型方法
console.log(redCar.drive === blueCar.drive); // true
```

### 原生对象的原型
JavaScript内置对象都有其原型链结构：
- **Object**：`Object.prototype` (原型链顶端)
- **Array**：`Array.prototype` → `Object.prototype`
- **Function**：`Function.prototype` → `Object.prototype`
- **Date**：`Date.prototype` → `Object.prototype`

```javascript
// 函数也是对象，有自己的原型链
function foo() {};
console.log(foo.__proto__ === Function.prototype); // true
console.log(Function.prototype.__proto__ === Object.prototype); // true
```

## 4. 原型继承的实现方式

### 1. 原型链继承
将父类实例作为子类原型：

```javascript
// 父类
function Animal(name) {
  this.name = name;
  this.features = ['eyes', 'ears'];
}
Animal.prototype.eat = function() {
  console.log(`${this.name} is eating`);
};

// 子类
function Dog(name) {
  this.name = name;
}

// 继承：将父类实例作为子类原型
Dog.prototype = new Animal();
Dog.prototype.constructor = Dog; // 修复constructor指向

const dog = new Dog('Buddy');
dog.eat(); // 'Buddy is eating'
console.log(dog.features); // ['eyes', 'ears']
```
缺点：父类引用类型属性会被所有子类实例共享，修改一个会影响其他。

### 2. 构造函数继承
在子类构造函数中调用父类构造函数：

```javascript
function Animal(name) {
  this.name = name;
  this.features = ['eyes', 'ears'];
}

function Dog(name) {
  // 继承属性
  Animal.call(this, name);
}

const dog1 = new Dog('Buddy');
const dog2 = new Dog('Max');

dog1.features.push('tail');
console.log(dog1.features); // ['eyes', 'ears', 'tail']
console.log(dog2.features); // ['eyes', 'ears'] (不共享)
```
缺点：无法继承父类原型上的方法。

### 3. 组合继承
结合原型链和构造函数继承：

```javascript
function Animal(name) {
  this.name = name;
  this.features = ['eyes', 'ears'];
}
Animal.prototype.eat = function() {
  console.log(`${this.name} is eating`);
};

function Dog(name) {
  Animal.call(this, name); // 继承属性
}
Dog.prototype = new Animal(); // 继承方法
Dog.prototype.constructor = Dog;

// 子类特有方法
Dog.prototype.bark = function() {
  console.log('Woof!');
};
```
优点：既继承属性又继承方法，且属性不共享。

### 4. ES6 Class继承
语法糖实现，本质仍是原型继承：

```javascript
class Animal {
  constructor(name) {
    this.name = name;
    this.features = ['eyes', 'ears'];
  }
  
  eat() {
    console.log(`${this.name} is eating`);
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name); // 调用父类构造函数
  }
  
  bark() {
    console.log('Woof!');
  }
}

const dog = new Dog('Buddy');
dog.eat(); // 'Buddy is eating'
dog.bark(); // 'Woof!'
```

## 5. 常见原型操作方法

### 1. `Object.create()`
创建一个新对象，指定其原型：
```javascript
const parent = { name: 'Parent' };
const child = Object.create(parent);
console.log(child.__proto__ === parent); // true
console.log(child.name); // 'Parent'
```

### 2. `Object.getPrototypeOf()` / `Object.setPrototypeOf()`
获取/设置对象原型：
```javascript
const obj = {};
const proto = { foo: 'bar' };

Object.setPrototypeOf(obj, proto);
console.log(Object.getPrototypeOf(obj) === proto); // true
console.log(obj.foo); // 'bar'
```

### 3. `hasOwnProperty()`
检查属性是否为对象自身属性（非继承）：
```javascript
const obj = { a: 1 };
obj.__proto__.b = 2;

console.log(obj.hasOwnProperty('a')); // true
console.log(obj.hasOwnProperty('b')); // false
```

### 4. `isPrototypeOf()`
检查对象是否在另一个对象的原型链上：
```javascript
const proto = {};
const obj = Object.create(proto);
console.log(proto.isPrototypeOf(obj)); // true
```

## 6. 原型链相关面试题

### Q1: 以下代码输出结果是什么？
```javascript
function Foo() {
  getName = function() { console.log(1); };
  return this;
}
Foo.getName = function() { console.log(2); };
Foo.prototype.getName = function() { console.log(3); };
var getName = function() { console.log(4); };
function getName() { console.log(5); }

Foo.getName();
getName();
Foo().getName();
getName();
new Foo.getName();
new Foo().getName();
new new Foo().getName();
```

**答案**：2, 4, 1, 1, 2, 3, 3

**解析**：涉及变量提升、函数优先级、原型链查找、this绑定和new操作符优先级。

### Q2: 如何实现一个instanceof运算符？

**答案**：检查构造函数的prototype是否在实例对象的原型链上：
```javascript
function myInstanceof(obj, constructor) {
  if (obj === null || typeof obj !== 'object') return false;
  let proto = Object.getPrototypeOf(obj);
  while (true) {
    if (proto === null) return false;
    if (proto === constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
}

// 测试
console.log(myInstanceof([], Array)); // true
console.log(myInstanceof({}, Object)); // true
console.log(myInstanceof(123, Number)); // false (基本类型)
```

### Q3: 原型链的终点是什么？`Object.prototype.__proto__`的值是什么？

**答案**：原型链的终点是`null`，`Object.prototype.__proto__ === null`。这是JavaScript引擎规定的，避免无限循环查找。

## 7. 总结与注意事项

原型和原型链是JavaScript的核心，理解它们有助于：
- 掌握对象属性查找机制
- 理解继承的实现原理
- 优化代码结构和性能

**注意事项**：
1. 避免直接修改`__proto__`，影响性能且非标准
2. 谨慎扩展原生对象原型（如`Array.prototype`），可能导致冲突
3. 使用`hasOwnProperty()`检查属性是否为自身属性
4. ES6 `class`语法更清晰，但仍需理解底层原型机制

原型系统虽然初学时较难理解，但掌握后能极大提升JavaScript编程能力和面试竞争力。建议结合调试工具（如Chrome DevTools的Prototype面板）直观观察原型链结构。

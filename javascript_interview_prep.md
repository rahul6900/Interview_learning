# ⚡ JavaScript Master Interview Preparation Guide
> **Target:** 1–3 Years Experience (React/Node.js Developer)  
> **Key Topics:** Closures, Event Loop, Hoisting, Arrow Functions, Array Methods, Promises & Async/Await.

---

## 📌 Table of Contents
1. [Closures (Definition, Practical Example, var vs let in Loop Trap)](#1-closures--interview-traps)
2. [Event Loop Architecture (Call Stack, Microtask vs Macrotask Queue)](#2-event-loop-architecture)
3. [Hoisting & Temporal Dead Zone (TDZ)](#3-hoisting--temporal-dead-zone-tdz)
4. [Regular Functions vs Arrow Functions (`this` binding)](#4-regular-functions-vs-arrow-functions)
5. [Array Methods: `map` vs `forEach` vs `filter` vs `reduce`](#5-array-methods-mastery)
6. [Promises & `async/await` (Error Handling & Promise.all)](#6-promises--asyncawait)
7. [Equality: `==` vs `===` & Pass by Value vs Reference](#7-equality--memory-reference)

---

## 1. Closures & Interview Traps

### Definition:
Closure function ki wo ability hai jisse wo apne outer (lexical) scope ke variables ko yaad rakhta hai, chahe outer function execute hoke return ho chuka ho.

### Code Example:
```javascript
function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

### ⚠️ Trap Question: `var` vs `let` in Loop with `setTimeout`
```javascript
// Case A: var
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// ❌ Output: 3, 3, 3 
// Kyunki 'var' function/globally scoped hai aur poore loop me ek hi 'i' share hota hai.

// Case B: let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// ✅ Output: 0, 1, 2
// Kyunki 'let' block-scoped hai aur har iteration ke liye naya 'i' closure banta hai.
```

---

## 2. Event Loop Architecture

JavaScript **Single-Threaded** aur synchronous language hai, par asynchronous operations ko browser APIs aur Event Loop ke through handle karti hai.

### Order of Execution (Priority):
1. **Call Stack:** Synchronous code turant execute hota hai.
2. **Microtask Queue:** Promises (`.then`, `async/await`), `queueMicrotask` (High Priority).
3. **Macrotask / Callback Queue:** `setTimeout`, `setInterval`, DOM Events (Lower Priority).

### Classic Output Question:
```javascript
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");

// 🎯 Output Sequence: 1, 4, 3, 2
```

---

## 3. Hoisting & Temporal Dead Zone (TDZ)

* **Hoisting:** JavaScript execution se pehle memory creation phase me variable aur function declarations ko scope ke top par le jati hai.
* **`var`:** Hoist hota hai aur default value **`undefined`** milti hai.
* **`let` aur `const`:** Hoist hote hain par initialize nahi hote. Wo **Temporal Dead Zone (TDZ)** me rehte hain jab tak unki declaration line execute na ho jaye.

```javascript
console.log(a); // undefined
var a = 10;

console.log(b); // ❌ ReferenceError: Cannot access 'b' before initialization
let b = 20;
```

---

## 4. Regular Functions vs Arrow Functions

| Feature | Regular Function (`function() {}`) | Arrow Function (`() => {}`) |
| :--- | :--- | :--- |
| **`this` Binding** | Dynamic (jis object ne call kiya wahi `this` hai) | Lexical (apna `this` nahi hota, parent scope se leta hai) |
| **`arguments` Object**| Available hota hai | Available nahi hota (use `...args` instead) |
| **Constructor (`new`)**| `new Func()` chalta hai | `new () => {}` error deta hai (Cannot be constructor) |

---

## 5. Array Methods Mastery

### `map()` vs `forEach()`

| Feature | `map()` | `forEach()` |
| :--- | :--- | :--- |
| **Return Value** | Naya modified array return karta hai | Hamesha **`undefined`** return karta hai |
| **Chaining** | Dusre methods (`.filter().sort()`) chain kar sakte hain | Chaining possible nahi hai |
| **Use Case** | Data transform karke naya array banana (e.g., JSX me render karna) | Sirf side-effects chalana (e.g., console.log, DB save) |

### `filter()` vs `reduce()`
* **`filter()`:** Array me se specific condition match karne wale elements ka sub-array deta hai:
  ```javascript
  const evens = [1, 2, 3, 4].filter(n => n % 2 === 0); // [2, 4]
  ```
* **`reduce()`:** Poore array ke elements ko process karke ek **single value** (number, object, ya array) me accumulate karta hai:
  ```javascript
  const sum = [10, 20, 30].reduce((acc, curr) => acc + curr, 0); // 60
  ```

---

## 6. Promises & Async/Await

### States of a Promise:
1. `Pending` (Initial)
2. `Fulfilled` (Resolved with data)
3. `Rejected` (Failed with error)

### Combinators (Interview Favorites):
* **`Promise.all([p1, p2])`:** Saare pass honge tabhi resolve hoga; ek bhi fail hua toh pura fail (Fast-fail).
* **`Promise.allSettled([p1, p2])`:** Har promise ka status deta hai (`fulfilled` ya `rejected`), chahe koi fail bhi ho.
* **`Promise.race([p1, p2])`:** Jo promise sabse pehle finish hoga (pass ya fail), wahi result dega.

---

## 7. Equality & Pass by Reference

* **`==` (Loose Equality):** Type coercion karta hai (convert karke compare karta hai): `'5' == 5` -> `true`.
* **`===` (Strict Equality):** Value aur Data Type dono check karta hai: `'5' === 5` -> `false`.

### Object / Array Comparison Trap:
```javascript
console.log({} === {}); // ❌ false (Dono memory me alag-alag address pe hain)
console.log([] === []); // ❌ false
```

---

## 8. Top JavaScript Coding Interview Snippets ⭐⭐⭐

### Task 1: Array se Duplicates Remove Karna
```javascript
const numbers = [1, 2, 2, 3, 4, 4, 5, 1];

// Method 1: Using Set (Modern & 1-Liner) ⭐
const unique1 = [...new Set(numbers)];
console.log(unique1); // [1, 2, 3, 4, 5]

// Method 2: Using Loop + includes()
const unique2 = [];
for (let num of numbers) {
  if (!unique2.includes(num)) {
    unique2.push(num);
  }
}
console.log(unique2); // [1, 2, 3, 4, 5]

// Method 3: Using filter() + indexOf()
const unique3 = numbers.filter((item, index) => numbers.indexOf(item) === index);
console.log(unique3); // [1, 2, 3, 4, 5]
```

### Task 2: String Reverse Karna
```javascript
const str = "hello";

// Method 1: Built-in methods
const reversed1 = str.split("").reverse().join(""); // "olleh"

// Method 2: Loop (Without built-in methods)
let reversed2 = "";
for (let i = str.length - 1; i >= 0; i--) {
  reversed2 += str[i];
}
```

### Task 3: Palindrome Check Karna
```javascript
function isPalindrome(str) {
  const rev = str.split("").reverse().join("");
  return str === rev;
}
console.log(isPalindrome("racecar")); // true
console.log(isPalindrome("hello"));   // false
```

### Task 4: Find Max & Min in Array
```javascript
const arr = [12, 45, 2, 89, 34];

// Method 1: Math.max / Math.min with Spread Operator (1-Liner) ⭐
const max1 = Math.max(...arr); // 89
const min1 = Math.min(...arr); // 2

// Method 2: Single Loop (O(n))
let max2 = arr[0];
let min2 = arr[0];

for (let i = 1; i < arr.length; i++) {
  if (arr[i] > max2) max2 = arr[i];
  if (arr[i] < min2) min2 = arr[i];
}
console.log("Max:", max2, "Min:", min2);
```

### Task 5: Array Sum, Filter & Map (1-Liners)
```javascript
const numbers = [1, 2, 3, 4, 5, 6];

// 1. Sum using reduce:
const totalSum = numbers.reduce((acc, curr) => acc + curr, 0); // 21

// 2. Filter even numbers:
const evens = numbers.filter(n => n % 2 === 0); // [2, 4, 6]

// 3. Double each number using map:
const doubled = numbers.map(n => n * 2); // [2, 4, 6, 8, 10, 12]
```




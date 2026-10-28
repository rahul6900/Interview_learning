# 🚀 JavaScript & Node.js + REST APIs Master Interview Guide
> **Target:** Junior Engineer Interview Preparation (31st Oct)  
> **Company:** Asaeta Pvt Ltd (Indore)  
> **Topics:** Core JS, Closures, Event Loop, Async/Await, Express, REST APIs, JWT

---

## 📌 Table of Contents
1. [var vs let vs const & Hoisting](#1-var-vs-let-vs-const--hoisting)
2. [== vs === (Type Coercion)](#2--vs--type-coercion)
3. [Pure Functions vs Impure Functions (React & Redux Foundation) ⭐](#3-pure-functions-vs-impure-functions)
4. [Closures (Definition, Use Cases, aur Avoid kaise karein) ⭐⭐⭐](#4-closures-in-javascript)
5. [Sync vs Async & Blocking vs Non-Blocking (Node.js Architecture) ⭐⭐⭐](#5-sync-vs-async--blocking-vs-non-blocking-nodejs-architecture)
6. [The Event Loop Mastery & Output Questions ⭐⭐⭐](#6-the-event-loop-mastery)
7. [Promises vs Async/Await & Callback Hell](#7-promises-vs-asyncawait)
8. [Array Methods: map vs filter vs reduce vs forEach ⭐⭐⭐](#8-array-methods-map-vs-filter-vs-reduce-vs-foreach)
9. [REST API Principles & HTTP Status Codes ⭐⭐⭐](#9-rest-api-principles-design--http-status-codes)
10. [PUT vs PATCH (Classic Trap)](#10-put-vs-patch)
11. [Express.js Middleware & next()](#11-expressjs-middleware--next)
12. [Authentication vs Authorization & JWT Security ⭐⭐⭐](#12-authentication-vs-authorization--jwt-security)

---

## 1. var vs let vs const & Hoisting

| Feature | `var` | `let` | `const` |
| :--- | :--- | :--- | :--- |
| **Scope** | Function Scope | Block Scope `{}` | Block Scope `{}` |
| **Re-declaration** | ✅ Allowed | ❌ SyntaxError | ❌ SyntaxError |
| **Re-assignment** | ✅ Allowed | ✅ Allowed | ❌ TypeError |
| **Hoisting** | Hoist hota hai with `undefined` | Hoist hota hai par **Temporal Dead Zone (TDZ)** me rehta hai | Hoist hota hai par **TDZ** me rehta hai |

### 💡 Interview Output Question:
```javascript
console.log(a); // Output: undefined
var a = 10;

console.log(b); // Output: ReferenceError: Cannot access 'b' before initialization
let b = 20;
```
> **Explanation:** `var` ko memory allocation ke waqt `undefined` mil jata hai, lekin `let` aur `const` tab tak TDZ me rehte hain jab tak unki line execute na ho.

---

## 2. == vs === (Type Coercion)

* **`==` (Loose Equality):** Sirf **Value** compare karta hai. Type alag ho to JavaScript zabardasti convert (Type Coercion) kar leta hai.
* **`===` (Strict Equality):** **Value + Data Type** dono check karta hai. No type conversion.

```javascript
console.log(5 == "5");  // Output: true  (String '5' number 5 ban gaya)
console.log(5 === "5"); // Output: false (Number !== String)
```

---

## 3. Pure Functions vs Impure Functions ⭐

Ek function ko **Pure Function** tab bolte hain jab wo 2 Golden Rules follow karta hai:
1. **Same Input ➔ Same Output:** Har baar same arguments dene par hamesha wahi same result dega (Predictable).
2. **No Side Effects:** Bahar ke kisi global variable, database, ya DOM ko modify nahi karega.

```javascript
// ✅ PURE FUNCTION:
function add(a, b) {
  return a + b; // Hamesha 2 + 3 = 5 dega, no side effect!
}

// ❌ IMPURE FUNCTION (Side effect on outer variable):
let total = 0;
function addToTotal(val) {
  total += val; // Bahar ka variable chhed diya!
  return total;
}

// ❌ IMPURE FUNCTION (Unpredictable output):
function getRandom() {
  return Math.random(); // Har bar alag value aayegi!
}
```
> **React & Redux Importance:** React components aur Redux Reducers hamesha **Pure Functions** hone chahiye taaki UI rendering me koi unwanted bugs ya side effects na aayein!

---

## 4. Closures in JavaScript ⭐⭐⭐

### Definition (Paribhasha):
> **"Jab ek Inner function apne Outer function ke variables ko yaad rakhta hai, chahe Outer function execute hokar memory se khatam hi kyu na ho gaya ho — isko CLOSURE kehte hain!"**

### Code Example:
```javascript
function createCounter() {
  let count = 0; // Private variable

  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // Output: 1
console.log(counter()); // Output: 2
```

### Purpose & Use Cases (Kyu use karte hain?):
1. **Data Privacy / Encapsulation:** Bahar se koi bhi `count = 100` karke data corrupt nahi kar sakta.
2. **React's `useState`:** React ka `useState` hook internally closures par hi kaam karta hai re-render hone par state yaad rakhne ke liye!

### ⚠️ Closure ko Avoid / Clean karne ka Sabse Best Tarika:
* **Best Method 1 (Pure Functions):** Bahar ke variable par depend karne ke badle data ko **parameters** me pass karo: `function add(a, b) { return a + b; }`.
* **Best Method 2 (Reference ko `null` karna):** Kaam khatam hone par `counter = null;` kar do taaki Garbage Collector RAM free kar sake.
* **Best Method 3 (React me Cleanup):** `useEffect` ke andar return me event listener remove karna:
  ```javascript
  useEffect(() => {
    const handleResize = () => { ... };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // 👈 Memory Leak avoid karta hai
  }, []);
  ```

---

## 5. Sync vs Async & Blocking vs Non-Blocking (Node.js Architecture) ⭐⭐⭐

Node.js ka official definition hai: **"Single-Threaded, Asynchronous, Non-Blocking Event-Driven Runtime"**.

### Inka Farak, Paribhasha (Definitions) & Real Production Uses:

| Concept | Hindi Definition | Real-Life Analogy | Production me Kahan Use Hota Hai? (Use Cases) |
| :--- | :--- | :--- | :--- |
| **Synchronous** | Ek ke baad ek line execute hoti hai. Agli line tab tak nahi chalegi jab tak pichhli line poori na ho jaye. | Bank ATM ki line (Jab tak aage wala paise na nikaale, peeche wale wait karte hain) | In-memory calculations, math operations, input validations, password hashing |
| **Asynchronous** | Time lene wale kaam background me shuru ho jaate hain aur main code bina ruke aage badhta hai. | Restaurant me waiter ko order dekar table par baithna | Database queries (`find()`, SQL `SELECT`), Third-party API calls (`fetch`), File reading |
| **Blocking** | Ek lamba operation chalne par poora JavaScript execution thread **JAM (Freeze)** ho jata hai. | Road par aage gaadi kharab ho gayi to poora traffic ruk gaya | `fs.readFileSync()` (⚠️ Danger: Sirf server start/config load par use hota hai, API route me KABHI nahi!) |
| **Non-Blocking** | Heavy kaam background (Libuv thread pool) ko dekar server agle user ki requests lene ke liye free rehta hai. | McDonald's counter: Cashier ne slip di aur agle customer ka order lene laga | High-traffic web servers (Ek hi thread par bina freeze huye 10,000+ simultaneous users handle karna) |

---

### Code Comparison (Blocking vs Non-Blocking):

```javascript
// ❌ BLOCKING CODE (Server crash / Freeze khatra):
// 500MB ki file padhne me 5 second lage. In 5 seconds me koi aur user website login nahi kar sakta!
const data = fs.readFileSync("huge_file.txt");
console.log("File read ho gayi!");

// ✅ NON-BLOCKING CODE (Production Standard):
// File reading background (Libuv) ko dedi, server agle user ke liye 100% free raha!
fs.readFile("huge_file.txt", (err, data) => {
  console.log("File read ho gayi!");
});
console.log("Server agle users ki request handle karne ke liye ready hai!");
```

---

## 6. The Event Loop Mastery ⭐⭐⭐

### 💡 Kyu banaya gaya Event Loop? (Core Problem & Solution)
* **Problem:** JavaScript **Single-Threaded** hai (iska matlab ek time par sirf **EK hi kaam** kar sakta hai, ek hi Call Stack hota hai). Agar JS ko koi 5 second lene wala kaam (jaise File Read ya API Call) karna pade, to poori website ya server **FREEZE (Hang)** ho jayega!
* **Solution:** JavaScript heavy kaam khud nahi karta — wo unhe **Browser (Web APIs)** ya **Node.js (Libuv C++ Background)** ko de deta hai.
* **Event Loop ka Kaam:** Jab background me kaam poora ho jata hai, to us callback ko wapas Call Stack me lane ka kaam **Traffic Police ki tarah EVENT LOOP** karta hai!

---

### 🏥 The Doctor & Clinic Analogy (Zindagi bhar nahi bhologe!):
Imagine karo ek busy Doctor ka clinic hai:
1. **Doctor (Call Stack):** Doctor akela hai (Single-Threaded). Ek time par ek hi patient ko check kar sakta hai.
2. **X-Ray / Lab (Web APIs / Libuv):** Agar patient ko X-Ray ya blood test karana hai (`setTimeout`, `fetch`, DB query), to doctor usko Lab bhej deta hai. Doctor wahan baith kar wait nahi karta, wo seedha agle patient ko bulata hai!
3. **VIP / Emergency Line (Microtask Queue):** Jin patients ki report aayi hai aur serious hain (`Promise.then()`, `queueMicrotask`, `process.nextTick`).
4. **General Waiting Room (Macrotask Queue):** Routine checkup wale patients (`setTimeout`, `setInterval`, `setImmediate`).
5. **The Receptionist (EVENT LOOP):**
   * Receptionist doctor ke cabin par nazar rakhti hai: *"Kya Doctor free hain? (Kya Call Stack khali hai?)"*
   * Jab tak Doctor busy hai, kisi ko andar nahi jane deti!
   * **Jaise hi Doctor free hua (Call Stack empty):**
     * Pehle **VIP Line (Microtasks)** ke SARE patients ko ek-ek karke doctor ke paas bhejti hai.
     * Jab VIP line bilkul 0 ho jaye, tab **General Waiting Room (Macrotask)** se sirf **EK** patient ko bhejti hai.
     * Aur ye chakkar (Loop) lagataar chalta rehta hai!

---

### 🔄 Event Loop Execution Priority Order (The Golden Hierarchy):
```
1. Synchronous Code (Call Stack)  ➔ [Sabse Pehle]
          ⬇
2. Microtask Queue (VIP Lane)     ➔ [Promise.then, catch, finally, queueMicrotask]
   *(Node.js me process.nextTick isse bhi pehle chalta hai)*
          ⬇
3. Macrotask Queue (Normal Lane)  ➔ [setTimeout, setInterval, setImmediate, I/O]
```

---

### 💡 The Classic Interview Question (Step-by-Step Execution Trace):

```javascript
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

console.log("4");
```

#### 📊 Step-by-Step Trace Table:

| Step | Code Line | Kahan gaya? | Call Stack State | Microtask Queue (VIP) | Macrotask Queue | Output Screen |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | `console.log("1")` | Call Stack | Chal kar khatam | Empty | Empty | **`1`** |
| **2** | `setTimeout(..., 0)` | Web API / Libuv timer me gaya. 0ms baad callback queue me shift hua. | Empty | Empty | `[ () => log("2") ]` | `1` |
| **3** | `Promise.resolve().then(...)` | Promise turant resolve hua. `.then()` callback VIP queue me gaya. | Empty | `[ () => log("3") ]` | `[ () => log("2") ]` | `1` |
| **4** | `console.log("4")` | Call Stack | Chal kar khatam | `[ () => log("3") ]` | `[ () => log("2") ]` | **`1, 4`** |
| **5** | *(Sync Code Finished)* | **Call Stack is now EMPTY!** Event Loop action me aaya! | Empty | `[ () => log("3") ]` | `[ () => log("2") ]` | `1, 4` |
| **6** | Event Loop Check | Pehle VIP (Microtask) ko uthaya aur Call Stack me daala. | Chal kar khatam | **Empty** | `[ () => log("2") ]` | **`1, 4, 3`** |
| **7** | Event Loop Check | VIP line khali hai! Ab Macrotask se `setTimeout` callback uthaya. | Chal kar khatam | Empty | **Empty** | **`1, 4, 3, 2`** |

#### 🎯 Final Output:
```
1
4
3
2
```

---

### 🪤 Event Loop Trap #2: `new Promise()` ka Executor Synchronous hota hai! ⭐⭐⭐

```javascript
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

new Promise((resolve) => {
  console.log("3"); // 👈 DHYAN SE DEKHO: Ye line turant SYNCHRONOUS chalti hai!
  resolve();
}).then(() => {
  console.log("4"); // 👈 Ye .then() wala callback jata hai Microtask Queue me!
});

console.log("5");
```

#### 🎯 Output:
```
1
3
5
4
2
```

#### 💡 Interviewer ko Explanation:
* **`new Promise(...)` ka body:** Jab JavaScript `new Promise(...)` banata hai, to uske andar ka function (executor) **turant Call Stack me SYNCHRONOUSLY** chal jata hai! Isliye `1` ke baad turant **`3`** print hua!
* **Synchronous code continue:** Uske baad seedha agla synchronous code `console.log("5")` chala (isliye **`5`** print hua).
* **Microtask Queue:** `.then()` ka callback Microtask Queue me gaya tha, to Call stack khali hote hi pehle wo chala (isliye **`4`** print hua).
* **Macrotask Queue:** `setTimeout` ka callback sabse aakhri me chala (isliye **`2`** print hua).

---

### 🚀 Node.js Specific Interview Trap (`process.nextTick` vs `setImmediate`):
Agar interviewer puche: *"Node.js me `process.nextTick()` aur `setImmediate()` kahan fit hote hain?"*

* **`process.nextTick()`:** Ye **SUPER VIP** hai! Ye normal `Promise.then()` se bhi pehle chalta hai current operation khatam hote hi.
* **`setImmediate()`:** Ye Macrotask queue ki 'Check' phase me chalta hai (I/O callbacks ke baad).

```javascript
// Priority in Node.js:
// process.nextTick()  >  Promise.then()  >  setTimeout(fn, 0)  >  setImmediate()
```

---

### 📁 File Read / Database I/O Tasks Kahan Jaate Hain?
* **Normal Callback (`fs.readFile`):** Ye **Macrotask Queue** (Node.js Libuv ke **I/O Polling Phase**) me jata hai! Node.js ka Libuv C++ thread pool background me hard drive se file padhta hai, aur padhne ke baad callback ko Macrotask queue me bhej deta hai.
* **Modern Promise (`fs.promises.readFile` ya `await`):** Jab file padh li jaati hai aur Promise resolve hota hai, to `.then()` ya `await` ke baad ka code **Microtask Queue (VIP)** me jata hai!

---

### 🗣️ Interviewer ko English me kaise bolna hai? (Ready Speech):
> *"JavaScript is single-threaded, meaning it has only one Call Stack. To handle asynchronous operations without blocking the thread, JavaScript uses the Event Loop. When an async task like `setTimeout` or `fetch` is called, it is offloaded to Web APIs or Node's Libuv. Once finished, their callbacks are pushed to either the Microtask Queue (for Promises) or the Macrotask Queue (for timers). The Event Loop continuously monitors the Call Stack: once the stack is completely empty, it first drains all Microtasks, and then processes Macrotasks one by one."*

---

## 7. Promises vs Async/Await

* **Callback Hell:** Jab ek callback ke andar doosra, doosre ke andar teesra callback nest hota hai (Pyramid of Doom `})})}`).
* **Promise:** Ek object jo future me value resolve hone ya reject hone ka wada (promise) karta hai (`.then()` aur `.catch()`).
* **Async/Await:** Promises ko synchronous code ki tarah likhne ka sabse clean tarika (Try/Catch ke sath).

```javascript
// Clean Async/Await:
async function fetchUserData() {
  try {
    const res = await fetch("https://api.example.com/users");
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error("API Failed:", error);
  }
}
```

---

## 8. Array Methods: map vs filter vs reduce vs forEach ⭐⭐⭐

### 💡 10 Seconds ka Master Cheat Sheet:

| Method | Asli Matlab | Example | Output |
| :--- | :--- | :--- | :--- |
| **`filter()`** | Condition match karne wale items chhaanto (Chhalni) | `[10, 20, 30].filter(n => n > 15)` | `[20, 30]` (Naya Chhota Array) |
| **`map()`** | Har item ko transform karo (React UI list me use hota hai) | `[1, 2, 3].map(n => n * 2)` | `[2, 4, 6]` (Same Size Naya Array) |
| **`reduce()`** | Sabko calculate karke **Single Value** banao (Cart Total) | `[10, 20, 30].reduce((a, b) => a + b, 0)` | `60` (Single Number) |
| **`forEach()`** | Sirf loop chalao (kuch return nahi karta) | `[1, 2].forEach(n => console.log(n))` | `undefined` |

---

### Real-world Code Examples:

```javascript
const cart = [
  { item: "Shirt", price: 500 },
  { item: "Jeans", price: 1200 },
  { item: "Socks", price: 100 }
];

// 1. filter() - 1000 se saste items nikaalo:
const affordable = cart.filter(product => product.price < 1000);
// Result: [ { item: "Shirt", price: 500 }, { item: "Socks", price: 100 } ]

// 2. map() - Sirf product ke names ka array banao:
const itemNames = cart.map(product => product.item);
// Result: ["Shirt", "Jeans", "Socks"]

// 3. reduce() - Total Shopping Bill calculate karo:
// acc = Total running sum (start at 0), item = current product
const totalBill = cart.reduce((acc, item) => acc + item.price, 0);
// Result: 1800 (500 + 1200 + 100)

// 4. forEach() - Har item console par print karo:
cart.forEach(item => console.log(`${item.item}: ₹${item.price}`));
```

---

## 9. REST API Principles, Design & HTTP Status Codes ⭐⭐⭐

### 🌐 4 Golden Rules of REST APIs:
1. **Statelessness:** Server client ka koi session memory me nahi rakhta. Har request independent hoti hai.
2. **URLs me NOUNS use karo, VERBS nahi:**
   * ❌ Bad: `/getAllUsers`, `/createNewUser`, `/deleteUserById/101`
   * ✅ Best Practice: `GET /users`, `POST /users`, `DELETE /users/101`
3. **HTTP Methods define the Action:**
   * `GET`: Data read/fetch karna.
   * `POST`: Naya resource create karna (`201 Created`).
   * `PUT`: Full replacement karna.
   * `PATCH`: Partial update karna (1 ya 2 fields).
   * `DELETE`: Delete karna (`204 No Content`).

---

### 📦 Data Backend par kaise aata hai? (Params vs Query vs Body)

| Tarika | Syntax | Real Example | Kab use karein? |
| :--- | :--- | :--- | :--- |
| **Route Params** | `req.params` | `GET /users/101` ➔ `req.params.id` | Specific resource ko ID se target karne ke liye |
| **Query Params** | `req.query` | `GET /products?cat=shoes&sort=asc` ➔ `req.query.cat` | Filtering, Searching, Pagination ke liye |
| **Request Body** | `req.body` | `POST /users` (JSON Payload bhejna) | Form data, passwords, naya object save karne ke liye |

---

### 🚦 Top HTTP Status Codes (Interviewer ka Rapid-Fire):

| Status Code | Naam | Kab bhejte hain? | Real Scenario |
| :--- | :--- | :--- | :--- |
| **`200`** | **OK** | Request successful | `GET /users` se list mil gayi |
| **`201`** | **Created** | Naya resource create hua (POST) | Naya user ya product DB me save ho gaya |
| **`204`** | **No Content** | Success hui par return me kuch nahi bhejna | `DELETE /users/101` successful |
| **`400`** | **Bad Request** | Client/User ne galat ya adhura data bheja | Password field missing hai ya email format galat hai |
| **`401`** | **Unauthorized** | Token missing ya expired (Authentication fail) | Bina login kiye orders page access kiya |
| **`403`** | **Forbidden** | Logged in ho par permission nahi hai (Role fail) | Normal user Admin panel access kar raha hai |
| **`404`** | **Not Found** | Resource database me exist nahi karta | User ID 9999 nahi mili |
| **`500`** | **Internal Server Error** | Backend code me crash ya Database down | Unhandled exception / TypeError |

---

## 10. PUT vs PATCH

* **`PUT` (Full Replacement):** Agar user ke paas `{ name, email, age }` hai, aur aapne sirf `{ name: "Aman" }` bheja, to `PUT` baki `email` aur `age` ko delete/null kar dega!
* **`PATCH` (Partial Update):** Ye sirf bheje gaye field (`name`) ko update karega, baki `email` aur `age` waise ke waise bache rahenge.

---

## 11. Express.js Middleware & next()

> **Middleware Definition:** Request server par aane aur Response client ko bhejne ke beech me jo function run hota hai, use Middleware kehte hain.

```javascript
// Example: Authentication Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }
  // Agar sab theek hai to agle function par jao:
  next(); // 👈 next() call nahi kiya to request atak jayegi!
};
```

---

## 12. Authentication vs Authorization & JWT Security ⭐⭐⭐

### 🔑 Authentication vs Authorization (Sabse Bada Farak):

| Feature | Authentication (AuthN) | Authorization (AuthZ) |
| :--- | :--- | :--- |
| **Sawaal** | **"Aap kaun ho?"** (Identity verify karna) | **"Aapko kya permission hai?"** (Access verify karna) |
| **Kaise hota hai?** | Email + Password, OTP, Google Login | Roles & Permissions (Admin, User, Manager) |
| **Failure Status** | **`401 Unauthorized`** (Pehle Login karo!) | **`403 Forbidden`** (Logged in ho, par permission nahi hai!) |
| **Example** | Facebook par Login karna | Sirf Page Admin post delete kar sakta hai, normal user nahi |

---

### 📌 Security Full Forms:
* **JWT:** **JSON Web Token** (Stateless authentication token)
* **XSS:** **Cross-Site Scripting** (Hacker website me malicious JS code inject karta hai)
* **CSRF:** **Cross-Site Request Forgery** (Fake website user ke browser se authorized request bhejti hai)

---

### 🎟️ JWT (JSON Web Token) Kaise Kaam Karta Hai?

JWT token me dot `.` se alag huye **3 parts** hote hain: `header.payload.signature`

1. **Header (Alg & Type):** Token ka type (`JWT`) aur hashing algorithm (`HS256`).
2. **Payload (Data):** User ka non-sensitive data (`userId`, `role`, `name`). ⚠️ Password kabhi nahi rakhte!
3. **Signature (Security Stamp):** Header + Payload ko server ke Secret Key se encrypt karke banta hai taaki token tamper-proof rahe.

#### Node.js / Express me Code:
```javascript
const jwt = require("jsonwebtoken");

// 1. Token Banana (Login hone par):
const token = jwt.sign(
  { userId: user._id, role: user.role }, // Payload
  "SECRET_KEY_123",                      // Secret Key
  { expiresIn: "1h" }                    // Expiry time
);

// 2. Token Verify karna (Protected API Middleware me):
try {
  const decoded = jwt.verify(token, "SECRET_KEY_123");
  req.user = decoded; // req me user data daal do
  next();
} catch (err) {
  res.status(401).json({ message: "Invalid or Expired Token" });
}
```

---

### 🛡️ Token Kahan Store Karein: LocalStorage vs HttpOnly Cookie?

| Feature | LocalStorage | HttpOnly Cookie (Industry Standard ⭐) |
| :--- | :--- | :--- |
| **JS Access (`document.cookie`)** | ✅ Accessible (Koi bhi JS padh sakti hai) | ❌ Blocked (JavaScript access hi nahi kar sakti) |
| **XSS Attack (Cross-Site Scripting)**| ❌ **Vulnerable!** Hacker 1 line JS code se token chura leta hai | ✅ **Safe!** Hacker script token read hi nahi kar sakti |
| **CSRF Attack (Cross-Site Request Forgery)**| ✅ Immune to CSRF | ⚠️ Vulnerable, par `sameSite: 'strict'` se 100% safe ban jata hai |
| **Kab use karein?** | Theme mode (Dark/Light), Cart items | **User Authentication & Refresh Tokens** |

#### Express.js me Secure Cookie set karne ka code:
```javascript
res.cookie("token", jwtToken, {
  httpOnly: true,     // 👈 XSS attack block karega (JS can't read)
  secure: true,       // 👈 Sirf HTTPS connection par jayega
  sameSite: "strict"  // 👈 CSRF attack block karega (Only same domain)
});
```



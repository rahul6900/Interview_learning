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
5. [The Event Loop & Async Output Question ⭐⭐⭐](#5-the-event-loop-mastery)
6. [Array Methods: map vs forEach vs filter vs reduce](#6-array-methods)
7. [REST API Principles & HTTP Status Codes](#7-rest-api-principles--status-codes)
8. [PUT vs PATCH (Classic Trap)](#8-put-vs-patch)
9. [Express.js Middleware & next()](#9-expressjs-middleware)
10. [JWT (JSON Web Tokens) Authentication](#10-jwt-authentication)

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

## 4. The Event Loop Mastery ⭐⭐⭐

### The Famous Interview Question:
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

### 🎯 Correct Output Sequence:
```
1
4
3
2
```

### 💡 Kyu aaya aisa? (Interviewer ko explanation):
JavaScript me 3 cheezein hoti hain:
1. **Call Stack (Synchronous Code):** `console.log("1")` aur `console.log("4")` bina kisi delay ke seedha pehle chalte hain.
2. **Microtask Queue (High Priority - Promises):** `Promise.then()` Microtask queue me jata hai. Call stack khali hote hi **sabse pehle Microtasks chalte hain** (isliye **`3`** print hua!).
3. **Macrotask / Callback Queue (Low Priority - setTimeout/setInterval):** `setTimeout(..., 0)` Macrotask queue me jata hai. Microtask queue poori khali hone ke **BAAD** setTimeout chalta hai (isliye **`2`** sabse aakhri me print hua!).

> **Golden Rule:** Synchronous Code ➔ Microtasks (Promises) ➔ Macrotasks (setTimeout).

---

## 5. Promises vs Async/Await

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

## 6. Array Methods: map vs filter vs reduce vs forEach ⭐⭐⭐

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

## 7. REST API Principles & Status Codes

### HTTP Methods:
* **`GET`**: Data read/fetch karna.
* **`POST`**: Naya resource create karna.
* **`PUT`**: Poora resource replace/update karna.
* **`PATCH`**: Partial update karna (kisi ek specific field ko badalna).
* **`DELETE`**: Resource delete karna.

### Top 7 HTTP Status Codes (Interviewer Favorites):
* **`200 OK`**: Request successful.
* **`201 Created`**: Naya resource successfully create hua (`POST` request me).
* **`400 Bad Request`**: Client ne galat input/data bheja.
* **`401 Unauthorized`**: User logged in nahi hai (Token missing ya invalid).
* **`403 Forbidden`**: User logged in hai par usko permission nahi hai (e.g. Normal user Admin page access kar raha hai).
* **`404 Not Found`**: Resource nahi mila.
* **`500 Internal Server Error`**: Backend code me bug ya server crash.

---

## 8. PUT vs PATCH

* **`PUT` (Full Replacement):** Agar user ke paas `{ name, email, age }` hai, aur aapne sirf `{ name: "Aman" }` bheja, to `PUT` baki `email` aur `age` ko delete/null kar dega!
* **`PATCH` (Partial Update):** Ye sirf bheje gaye field (`name`) ko update karega, baki `email` aur `age` waise ke waise bache rahenge.

---

## 9. Express.js Middleware & next()

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

## 10. Authentication vs Authorization & JWT Security ⭐⭐⭐

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



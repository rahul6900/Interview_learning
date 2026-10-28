# ⚛️ React.js Master Interview Guide
> **Target:** Junior Engineer Interview Preparation (31st Oct)  
> **Company:** Asaeta Pvt Ltd (Indore)  
> **Topics:** Virtual DOM, Hooks, Props vs State, useEffect, useMemo vs useCallback, useRef, Context API

---

## 📌 Table of Contents
1. [Virtual DOM & Reconciliation (Diffing Algorithm)](#1-virtual-dom--reconciliation)
2. [Props vs State](#2-props-vs-state)
3. [useEffect Hook Mastery (All 4 Cases & Cleanup) ⭐⭐⭐](#3-useeffect-hook-mastery)
4. [useState & Asynchronous State Updates (Batching Trap) ⭐⭐](#4-usestate--batching-trap)
5. [useMemo vs useCallback (Performance Optimization) ⭐⭐⭐](#5-usememo-vs-usecallback)
6. [useRef (DOM Access vs Mutable State)](#6-useref-hook)
7. [Why Keys in Lists? (Index as Key Trap) ⭐](#7-why-keys-in-lists)
8. [Prop Drilling vs Context API vs Redux ⭐⭐⭐](#8-prop-drilling-vs-context-api-vs-redux-)
9. [Custom Hooks (How & Why to write them)](#9-custom-hooks)
10. [React Component Lifecycle (Functional Components)](#10-react-lifecycle-in-functional-components)

---

## 1. Virtual DOM & Reconciliation

* **Real DOM:** Browser ka actual HTML tree structure. Isme bar-bar update karna bohot slow hota hai kyunki browser ko poora page dobara calculate (Reflow & Repaint) karna padta hai.
* **Virtual DOM:** Real DOM ki lightweight memory copy (ek plain JavaScript Object).
* **Diffing Algorithm:** Jab state badalti hai, React naye aur purane Virtual DOM ko compare karke difference nikaalta hai.
* **Reconciliation:** Sirf us badle huye chote se hisse ko Real DOM me batch-update karta hai (bina poora page reload kiye!).

---

## 2. Props vs State

| Feature | Props | State |
| :--- | :--- | :--- |
| **Origin** | Parent component se pass hota hai (External) | Component ke andar define hota hai (Internal) |
| **Mutability** | **Read-Only (Immutable)** - Child component ise badal nahi sakta | **Mutable** (via setter function `setCount`) |
| **Control** | Parent component control karta hai | Component khud control karta hai |
| **Re-render** | Props badalne par child re-render hota hai | State badalne par component re-render hota hai |

---

## 3. useEffect Hook Mastery ⭐⭐⭐

Interviewer ka favorite hook! Iske 4 main scenarios hote hain:

```javascript
// Case 1: No Dependency Array
// Har ek render aur re-render par chalega (Avoid in production!)
useEffect(() => {
  console.log("Runs on EVERY render");
});

// Case 2: Empty Dependency Array []
// Sirf ek baar chalega jab Component MOUNT (screen par pehli bar load) hoga
// Best for: Backend APIs call karna, initial setup
useEffect(() => {
  console.log("Runs ONCE on Mount (like componentDidMount)");
  fetchData();
}, []);

// Case 3: With Dependencies [count]
// Mount par chalega + jab-jab 'count' state badlegi tab chalega
useEffect(() => {
  console.log("Runs when 'count' changes");
}, [count]);

// Case 4: With Cleanup Function
// Component UNMOUNT hone par chalega (Memory leak avoid karne ke liye)
useEffect(() => {
  const timer = setInterval(() => console.log("Tick"), 1000);

  return () => {
    clearInterval(timer); // 👈 Cleanup: Timer ko kill kar do
    console.log("Cleanup on Unmount");
  };
}, []);
```

---

## 4. useState & Batching Trap ⭐⭐

### 💡 Interviewer ka Favorite Code Sawaal:
```javascript
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
};
```
Interviewer: *"Button dabane par count kya hoga? 1 ya 3?"*
* **Answer:** 👉 **`1` hoga! (3 nahi hoga!)**
* **Kyu?** React state updates ko **Batch** karta hai performance ke liye. Teeno calls me `count` ki purani value `0` hi thi (`0 + 1 = 1`).

### Agar sach me +3 karna ho to kaise likhte hain? (Updater Function):
```javascript
const handleClick = () => {
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
}; // 👈 Ab count 3 ban jayega!
```

---

## 5. useMemo vs useCallback ⭐⭐⭐

Dono hooks **Performance Optimization (Faltu Re-renders rokne)** ke liye use hote hain. Lekin dono ka purpose alag-alag cheez ko cache (memoize) karna hota hai:

### 💡 10 Seconds ka Master Cheat Sheet:

| Feature | `useMemo` | `useCallback` |
| :--- | :--- | :--- |
| **Kya cache karta hai?** | Ek **Calculated Value / Result** (Number, Array, Object) | Ek **Function Definition (Function Reference)** |
| **Matlab (Analogy)** | *"Heavy calculation ka answer yaad rakho, bar-bar calculate mat karo!"* | *"Purana function hi yaad rakho, re-render par naya function mat banao!"* |
| **Syntax** | `const result = useMemo(() => computeHeavy(a), [a]);` | `const handleClick = useCallback(() => doSomething(), []);` |
| **Kab use karein?** | 10,000 items ko filter/sort karte waqt, complex calculations me | Jab Child component (`React.memo`) ko function prop pass kar rahe ho |

---

### 🧠 JavaScript ka Secret: "Referential Equality" (Kyu zarurat padi useCallback ki?)
JavaScript me primitives (`5 === 5`) equal hote hain, lekin functions aur objects har render par **naya memory address** le lete hain:
```javascript
() => {} === () => {} // Output: FALSE! (Dono ka memory address alag hai)
```
Jab Parent component re-render hota hai, to uske andar ke normal functions dobara ban jaate hain. Child component ko lagta hai ki *"Are naya prop aaya hai!"*, aur Child bhi be-wajah re-render ho jata hai!

---

### 💻 Real-world Code Examples:

#### 1. `useMemo` Example (Heavy Calculation ko Cache karna):
```javascript
import React, { useState, useMemo } from 'react';

function ProductList({ products }) {
  const [theme, setTheme] = useState("dark");

  // ❌ Bina useMemo: Theme toggle karne par bhi 50,000 products dobara filter hote! (Lag hoti app)
  // ✅ useMemo ke sath: Sirf jab 'products' array badlega tabhi filter dobara chalega!
  const expensiveFilteredProducts = useMemo(() => {
    console.log("Heavy filtering running...");
    return products.filter(p => p.price > 1000);
  }, [products]);

  return <div>{/* Render filtered items */}</div>;
}
```

#### 2. `useCallback` Example (Child Component ka Re-render rokna):
```javascript
import React, { useState, useCallback } from 'react';

// Child component ko React.memo me wrap kiya taaki props same rahein to re-render na ho
const DeleteButton = React.memo(({ onDelete }) => {
  console.log("DeleteButton re-rendered!");
  return <button onClick={onDelete}>Delete Item</button>;
});

function App() {
  const [count, setCount] = useState(0);

  // ❌ Bina useCallback: Count badalne par naya function banta, aur DeleteButton bekar me re-render hota!
  // ✅ useCallback ke sath: Function reference same rahega, DeleteButton re-render NAHI hoga!
  const handleDelete = useCallback(() => {
    console.log("Item deleted");
  }, []); // Empty deps = Function instance hamesha same rahega

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <DeleteButton onDelete={handleDelete} />
    </div>
  );
}
```

---

### 📌 Short Definitions (Interviewer ko sunane ke liye):
* **`useMemo`:**
  * **English:** *"useMemo is a React hook that caches the **result of an expensive calculation** so it is not re-computed on every render."*
  * **Hindi:** *"useMemo kisi heavy calculation ke **answer/result** ko memory me store kar leta hai, taaki har re-render par dobara calculate na karna pade."*
* **`useCallback`:**
  * **English:** *"useCallback is a React hook that caches the **function definition itself** between renders to prevent unnecessary re-renders of child components."*
  * **Hindi:** *"useCallback **function definition (reference)** ko cache karta hai, taaki har render par naya function na bane aur Child component bekar me re-render na ho."*

---

### 🗣️ Complete Ready-to-Speak Interview Answer:

#### English Speech:
> *"Both `useMemo` and `useCallback` are optimization hooks in React used to prevent unnecessary computations and re-renders.*  
> *1. **`useMemo`** caches the **result of a calculation** so expensive operations (like filtering or sorting 10,000 items) aren't re-run on every render.*  
> *2. **`useCallback`** caches the **function definition itself** between renders. In JavaScript, functions are recreated on every render with new memory references. By wrapping a callback in `useCallback`, we pass a stable reference to memoized child components (`React.memo`), preventing them from re-rendering unnecessarily."*

#### Hindi Speech:
> *"Sir, dono hooks React me faltu re-renders rok kar speed badhane ke liye use hote hain:*  
> *1. **`useMemo`** ek **value / calculation result** ko yaad rakhta hai — jaise 10,000 items ka filter ya total bill calculation. Agar dependencies nahi badli, to ye purana calculated answer hi return kar deta hai.*  
> *2. **`useCallback`** ek **function** ko yaad rakhta hai. Normal JS me har render par naya function naye memory address ke sath banta hai jisse child component re-render hota hai. `useCallback` lagane se function ka reference same rehta hai aur child component bekar me re-render nahi hota."*

---

## 6. useRef Hook (DOM Access vs Mutable State) ⭐⭐⭐

### 📌 Short Definitions (Interviewer ko sunane ke liye):
* **`useRef` Definition:**
  * **English:** *"useRef is a built-in React hook that returns a mutable object whose `.current` property persists across renders WITHOUT triggering a re-render when changed."*
  * **Hindi:** *"useRef ek aisa hook hai jo kisi value ko memory me safely store rakhta hai, aur iski value badalne par component **KABHI BHI Re-render nahi hota**."*

---

### ⚖️ `useState` vs `useRef` (Sabse Bada Farak):

| Feature | `useState` | `useRef` |
| :--- | :--- | :--- |
| **Re-render Trigger?** | ✅ **YES!** State change hone par poora component dobara render hota hai. | ❌ **NO!** `.current` value change hone par **koi re-render nahi hota**. |
| **Data Access** | `count` variable se direct read hota hai | `ref.current` property se read/write hota hai |
| **Real Life Analogy** | **Notice Board** (Khabar badli to sabko pata chala, sabka dhyan gaya) | **Pocket Diary** (Chupke se diary me note likh liya, kisi ko pata nahi chala) |
| **Kab use karein?** | Jab badlav ko **Screen par UI me turant dikhana** ho (Counter, Form inputs) | Jab background me data track karna ho ya **DOM element access** karna ho |

---

### 🎯 `useRef` ke 2 Sabse Bade Real-World Use Cases:

#### Use Case 1: Direct DOM Element ko Access karna (Focus, Scroll, Video):
React me hum `document.getElementById` use nahi karte. Uske badle `useRef` use karte hain:
```javascript
import React, { useRef } from 'react';

function SearchBar() {
  const inputRef = useRef(null);

  const handleSearchClick = () => {
    // 👈 Direct browser DOM input par focus kar diya!
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} placeholder="Search products..." />
      <button onClick={handleSearchClick}>Focus Search</button>
    </div>
  );
}
```

#### Use Case 2: Timer ID ya Background Value store karna (Bina Re-render ke):
```javascript
import React, { useState, useRef } from 'react';

function StopWatch() {
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null); // Timer ID store karne ke liye

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current); // 👈 Timer ID safely access kiya bina re-render ke!
  };

  return (
    <div>
      <h1>Seconds: {seconds}</h1>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
}
```

---

### 🗣️ Complete Ready-to-Speak Interview Answer:

#### English Speech:
> *"The biggest difference between `useState` and `useRef` is that updating a `useState` variable triggers a component re-render, whereas mutating `useRef.current` does **NOT** trigger a re-render.*  
> *`useRef` has two primary use cases:*  
> *1. **Accessing DOM nodes directly**—such as imperatively focusing an input field, scrolling to a container, or playing/pausing a video element.*  
> *2. **Storing mutable instance variables across renders**—such as storing a timer ID (`setInterval`), previous state values, or tracking render counts without causing an infinite re-render loop."*

#### Hindi Speech:
> *"Sir, `useState` aur `useRef` me sabse bada farak ye hai ki `useState` ki value badalne par component re-render hota hai aur UI update hoti hai, jabki `useRef.current` badalne par **koi re-render nahi hota**.*  
> *`useRef` ke 2 main use cases hote hain:*  
> *1. **Direct DOM access karna:** Jaise search bar par auto-focus karna ya kisi video element ko play/pause karna.*  
> *2. **Background data store karna:** Jaise `setInterval` ki Timer ID store karna, taaki component band hone par timer ko kill kiya ja sake bina faltu re-render karwaye."*

---

## 7. Why Keys in Lists? (The Index as Key Trap) ⭐⭐⭐

### 🔑 Key ka Kaam Kya Hai? (Definition):
> **English Definition:** *"Keys help React identify which items in a list have changed, been added, or removed. React uses keys during the Reconciliation (Diffing) process to update only the specific DOM elements instead of re-rendering the entire list."*  
> **Hindi Definition:** *"Keys React ke liye ek aisi Unique ID (aadhar card) hoti hain jisse React ko pata chalta hai ki list me kaun sa naya item juda hai ya kaun sa delete hua hai, taaki poori list dobara render na karni pade."*

---

### ⚠️ The Interview Trap: *"List me `key={index}` kyu nahi lagana chahiye?"*

```javascript
// ❌ BAD PRACTICE (Interview trap):
{todos.map((todo, index) => (
  <TodoItem key={index} text={todo.text} />
))}

// ✅ BEST PRACTICE (Always use Unique ID):
{todos.map((todo) => (
  <TodoItem key={todo.id} text={todo.text} />
))}
```

---

### 💥 Asli Problem kya hoti hai agar `key={index}` use karein?
Socho aapke paas 3 items hain:
* Index 0: `Apple`
* Index 1: `Banana`
* Index 2: `Mango`

Agar aapne **`Apple` (Index 0) ko delete kar diya**:
* Ab `Banana` ka naya index ban gaya **0**, aur `Mango` ka ban gaya **1**.
* React sochega: *"Index 0 to abhi bhi exist karta hai, sirf Index 2 gayab hua hai!"*
* **Khatarnaak Bug (State Glitch):** Agar har item ke sath koi **Checkbox** ya **Input Box** tha, to tick kiya hua checkbox galat item par shift ho jayega!
* **Performance Drop:** React ko poori list ko dobara calculate karna padega kyunki sabke index change ho gaye.

---

### 🗣️ Interviewer ko bolne ke liye Ready Script:

#### English Speech:
> *"We should avoid using array `index` as a `key` if the list items can be re-ordered, filtered, or deleted.*  
> *When an item is removed from the middle or beginning of a list, the indexes of all remaining items shift. Because React relies on keys to track element identity in the Virtual DOM, shifting indexes causes React to confuse components. This leads to subtle UI bugs like inputs retaining values from deleted rows, and degrades performance. We should always use a stable, unique identifier like a database `id`."*

#### Hindi Speech:
> *"Sir, agar hum list items ko sort, filter ya delete karte hain to unka array index badal jata hai. Agar hum `key={index}` denge, to React confused ho jata hai aur galat item ka UI state (jaise input ya checkbox) doosre item me dikhane lagta hai. Isliye hamesha database ki unique ID (`id` ya `_id`) ko key banana chahiye."*

---

## 8. Prop Drilling vs Context API vs Redux ⭐⭐⭐

### 📌 Definitions:
* **Prop Drilling:**
  * **English:** *"Prop drilling occurs when data is passed from a parent component down through multiple nested intermediate components that do not need the data themselves, just to reach a deeply nested child."*
  * **Hindi:** *"Jab kisi deep child component tak data pahunchane ke liye hum beech ke 4-5 be-kasoor components me se zabardasti props pass karte hain jinhe us data ki koi zarurat nahi hoti, use Prop Drilling kehte hain."*

---

### ⚖️ Context API vs Redux (Kab kaun sa use karein?):

| Feature | Context API (React Built-in) | Redux / Redux Toolkit (External Library) |
| :--- | :--- | :--- |
| **Setup & Complexity** | Simple & lightweight (No extra package needed) | Boilerplate code zyada hota hai (Actions, Reducers, Store) |
| **Best For** | **Low-frequency updates** (Theme Dark/Light, User Auth, Language) | **High-frequency updates** & complex business logic |
| **Re-render Behavior** | Jab context change hota hai, to **sare consumers re-render** hote hain | Selectors (`useSelector`) ki wajah se **sirf wahi component re-render hota hai jiska data badla ho** |
| **Debugging Tools** | Basic React DevTools | Powerful Redux DevTools (Time-travel debugging, action history) |
| **Project Size** | Chote se medium scale applications | Badi enterprise applications (E-commerce, Trading dashboards) |

---

### 💻 Code Example (Context API Setup):

```javascript
import React, { createContext, useContext, useState } from 'react';

// 1. Context Banao:
const ThemeContext = createContext();

// 2. Parent me Provider se wrap karo:
export function App() {
  const [theme, setTheme] = useState("dark");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Navbar /> {/* Navbar ko prop dene ki zarurat nahi! */}
    </ThemeContext.Provider>
  );
}

// 3. Kisi bhi deep child me seedha use karo:
function ThemeToggleButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Current Theme: {theme}
    </button>
  );
}
```

---

### 🗣️ Complete Ready-to-Speak Interview Answer:

#### English Speech:
> *"Prop drilling is the process of passing props through intermediate components that do not need the data, simply to deliver it to a deeply nested child. This makes the code hard to maintain and tightly coupled.*  
> *To solve this:*  
> *1. For **small-to-medium apps** or data that changes infrequently (like user authentication, dark mode themes, or language selection), we use the built-in **Context API** with the `useContext` hook.*  
> *2. For **large-scale enterprise applications** with complex state, frequent updates, and multiple developers (like an e-commerce cart or financial dashboard), we use **Redux Toolkit**. Redux provides centralized state management, middleware support, and stops unnecessary re-renders through fine-grained selectors."*

#### Hindi Speech:
> *"Sir, jab kisi deep child component ko data bhejne ke liye hum beech ke saare components me zabardasti props pass karte hain, use Prop Drilling kehte hain. Isse code maintain karna bohot mushkil ho jata hai.*  
> *Iske solution ke liye:*  
> *1. Agar application **chhoti ya medium** hai aur data kam badalta hai (jaise Dark/Light theme ya User login info), to hum React ka built-in **Context API** aur `useContext` hook use karte hain.*  
> *2. Agar application **badi aur complex** hai (jaise E-commerce cart, payments, live notifications), to hum **Redux** use karte hain. Redux me state centralized hoti hai aur selectors ki wajah se faltu re-renders nahi hote."*

---

## 9. Custom Hooks

> **Definition:** Jab 2 ya usse zyada components me same logic (jaise API fetch karna ya window resize track karna) repeat ho raha ho, to hum use ek alag function me daal dete hain jo `use` se shuru hota hai.

```javascript
// Custom Hook: useFetch
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [url]);

  return { data, loading };
}
```

---

## 10. React Lifecycle in Functional Components

Class components ke 3 lifecycle methods functional components me `useEffect` se handle hote hain:

| Lifecycle Phase | Class Component | Functional Component (`useEffect`) |
| :--- | :--- | :--- |
| **Mounting (Screen par aana)** | `componentDidMount` | `useEffect(() => { ... }, [])` |
| **Updating (State/Props badalna)**| `componentDidUpdate` | `useEffect(() => { ... }, [state])` |
| **Unmounting (Screen se hatna)**| `componentWillUnmount` | `useEffect(() => { return () => cleanup(); }, [])` |

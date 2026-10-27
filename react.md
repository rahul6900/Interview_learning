# ⚛️ React.js Master Interview Guide
> **Target:** Junior Engineer Interview Preparation (31st Oct)  
> **Company:** Asaeta Pvt Ltd (Indore)  
> **Topics:** Virtual DOM, Hooks, Props vs State, useEffect, useMemo vs useCallback, Context API

---

## 📌 Table of Contents
1. [Virtual DOM & Reconciliation (Diffing Algorithm)](#1-virtual-dom--reconciliation)
2. [Props vs State](#2-props-vs-state)
3. [useEffect Hook Mastery (All 3 Cases & Cleanup) ⭐⭐⭐](#3-useeffect-hook-mastery)
4. [useState & Asynchronous State Updates](#4-usestate-mastery)
5. [useMemo vs useCallback (Performance Optimization) ⭐⭐⭐](#5-usememo-vs-usecallback)
6. [useRef (DOM Access vs Mutable State)](#6-useref-hook)
7. [Why Keys in Lists? (Index as Key Trap)](#7-why-keys-in-lists)
8. [Prop Drilling vs Context API / Redux](#8-prop-drilling-vs-context-api)
9. [Custom Hooks (How & Why to write them)](#9-custom-hooks)

---

## 1. Virtual DOM & Reconciliation

* **Real DOM:** Browser ka actual HTML tree. Isme bar-bar update karna slow hota hai (Reflow & Repaint).
* **Virtual DOM:** Real DOM ki lightweight memory copy (JS Object).
* **Diffing Algorithm:** Purane aur naye Virtual DOM ke beech ka difference nikalna.
* **Reconciliation:** Sirf us badle huye part ko Real DOM me batch-update karna.

---

## 2. Props vs State

| Feature | Props | State |
| :--- | :--- | :--- |
| **Origin** | Parent component se pass hota hai (External) | Component ke andar define hota hai (Internal) |
| **Mutability** | **Read-Only (Immutable)** - Child badal nahi sakta | **Mutable** (via setter function `setCount`) |
| **Control** | Parent controls it | Component itself controls it |

---

## 3. useEffect Hook Mastery ⭐⭐⭐

```javascript
// Case 1: No Dependency Array
// Har ek render aur re-render par chalega (Slow)
useEffect(() => {
  console.log("Runs on EVERY render");
});

// Case 2: Empty Dependency Array []
// Sirf ek baar chalega jab Component MOUNT (load) hoga (Best for API calling)
useEffect(() => {
  console.log("Runs ONCE on Mount (like componentDidMount)");
}, []);

// Case 3: With Dependencies [count]
// Mount par chalega + jab-jab 'count' badlega tab chalega
useEffect(() => {
  console.log("Runs when 'count' changes");
}, [count]);

// Case 4: With Cleanup Function
// Component Unmount hone par chalega (Timer/Event listeners clear karne ke liye)
useEffect(() => {
  const timer = setInterval(() => console.log("Tick"), 1000);
  return () => clearInterval(timer); // 👈 Cleanup
}, []);
```

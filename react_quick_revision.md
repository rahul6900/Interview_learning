# ⚡ React.js Quick Interview Revision (Question & Answer Sheet)
> **Role:** React.js Developer (1–3 Years Experience)  
> **Company:** ClecoTech (Indore)  
> **Use:** Kal interview se pehle sirf is sheet ko 15 minute padh lena, saare core questions refreshed rahenge!

---

## 📌 Index of Discussed Questions
1. [Virtual DOM & Reconciliation](#q1-virtual-dom-diffing-algorithm--reconciliation)
2. [The `key` Prop & Why Index as Key is Bad](#q2-key-prop-in-lists--why-index-as-key-is-bad)
3. [All 3 Cases of `useEffect` & Infinite Loop](#q3-useeffect-dependency-array-scenarios--infinite-loop)
4. [Why `useEffect` Callback cannot be `async`?](#q4-why-can-we-not-make-useeffect-callback-directly-async)
5. [useMemo vs useCallback](#q5-usememo-vs-usecallback)
6. [useState vs useRef](#q6-usestate-vs-useref)
7. [Context API vs Redux Toolkit (RTK)](#q7-context-api-vs-redux-toolkit-rtk)
8. [Props vs State](#q8-props-vs-state)
9. [Conditional Rendering (Ternary vs &&)](#q9-conditional-rendering)
10. [Controlled vs Uncontrolled Components](#q10-controlled-vs-uncontrolled-components)
11. [State Batching & Asynchronous Updates (Updater Function)](#q11-state-batching--updater-function-form)
12. [Prop Drilling & Solutions](#q12-prop-drilling--solutions)
13. [React.memo vs useMemo](#q13-reactmemo-vs-usememo)
14. [Custom Hooks (Rules & Purpose)](#q14-custom-hooks)
15. [Code Splitting & Lazy Loading (React.lazy + Suspense)](#q15-code-splitting--lazy-loading-reactlazy--suspense)
16. [Error Boundaries in React](#q16-what-is-an-error-boundary)

---

### Q1. Virtual DOM, Diffing Algorithm & Reconciliation?
* **Problem:** Real DOM par direct updates slow hote hain kyunki browser ko **Reflow (Layout calculate)** aur **Repaint (Pixel redraw)** karna padta hai.
* **Virtual DOM:** Memory (RAM) ke andar Real DOM ki lightweight copy as a **JavaScript Object**.
* **Diffing:** State change par React naye aur purane V-DOM ko compare karta hai ($O(n)$ heuristic algorithm).
* **Reconciliation:** Sirf aur sirf badle hue specific nodes ko Real DOM me batch-update karna.

---

### Q2. `key` Prop in Lists & Why Index as Key is Bad?
* **Why Key:** React list ke har item ko uniquely identify karta hai taaki Diffing ke time pata chale kaunsa element Add, Delete, ya Reorder hua hai.
* **Index as Key Trap:** Agar list me se koi item delete ya sort hota hai, toh saare elements ke index shift ho jaate hain. React purani state galat element ko assign kar deta hai jisse UI glitch aate hain.
* **Best Practice:** Hamesha unique database ID (`item.id`) use karo.

---

### Q3. `useEffect` Dependency Array Scenarios & Infinite Loop?
1. `useEffect(() => {})` (No array): Har ek render aur re-render par chalta hai. (State update andar hui toh **Infinite Loop** crash!).
2. `useEffect(() => {}, [])` (Empty array): Sirf **ek baar** chalta hai jab component pehli baar mount hota hai.
3. `useEffect(() => {}, [count])`: Initial render + jab bhi `count` ki value badlegi.
4. **Cleanup (`return () => {}`):** Unmount hone par memory leaks rokne ke liye (clear timer, remove event listener).

---

### Q4. Why can we NOT make `useEffect` callback directly `async`?
* **Reason:** `useEffect` ya toh kuch return na kare (`undefined`), ya fir ek **Cleanup Function** return kare. JavaScript me har `async` function hamesha ek **Promise return karta hai**. React cleanup function ki jagah Promise aane par error deta hai.
* **Solution:** Effect ke andar ek helper async function bana kar turant call karo:
  ```javascript
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api");
      const json = await res.json();
      setData(json);
    };
    fetchData();
  }, []);
  ```

---

### Q5. `useMemo` vs `useCallback`?
* **`useMemo`:** Kisi heavy function ke **CALCULATION RESULT (Value)** ko cache karta hai.
* **`useCallback`:** Kisi **FUNCTION REFERENCE** ko cache karta hai taaki child components ko har render pe naya function reference na mile aur faaltu re-renders ruk sakein.

---

### Q6. `useState` vs `useRef`?
* **`useState`:** State change hone par component **RE-RENDER** hota hai (UI update karne ke liye).
* **`useRef`:** `.current` value change hone par component **RE-RENDER NAHI** hota.
  - *Use Cases:* Direct DOM access (e.g. `inputRef.current.focus()`) aur mutable timer ID store karna.

---

### Q7. Context API vs Redux Toolkit (RTK)?
* **Context API Issue:** Context ki koi bhi ek value badalegi, toh context ko consume karne wale **saare components re-render** ho jaate hain. (Good for Low-frequency data like Theme, Auth).
* **Redux Toolkit (RTK):** `useSelector` selective subscription deta hai — sirf wahi component re-render hoga jiska specific data change hua ho. (Good for High-frequency data like Cart, E-commerce, Dashboards).
* **RTK Flow:** `UI Event -> dispatch(action) -> Slice/Reducer -> Redux Store -> useSelector -> UI Update`.

---

### Q8. Props vs State?
* **Props:** Parent se child me pass hote hain, **Read-only (Immutable)** hote hain.
* **State:** Component ka apna private data hota hai, **Mutable** hota hai (via setter function).

---

### Q9. Conditional Rendering?
* **Ternary Operator (`? :`):**
  ```jsx
  {isLoggedIn ? <h1>Welcome!</h1> : <h1>Please Login</h1>}
  ```
* **Short-circuit Operator (`&&`):** (Sirf true condition par dikhana ho):
  ```jsx
  {isLoggedIn && <h1>Welcome!</h1>}
  ```

---

### Q10. Controlled vs Uncontrolled Components?
* **Controlled Component:** Input ki value React state (`useState`) control karti hai (`value={val}` + `onChange`).
* **Uncontrolled Component:** Input ki value direct browser DOM handle karta hai, aur React usko **`useRef`** ke through access karta hai (`inputRef.current.value`).

---

### Q11. State Batching & Updater Function Form?
Agar ek saath 3 baar `setCount(count + 1)` chalayein:
* Normal form: `setCount(count + 1)` 3 baar likhne par bhi count sirf **1** badhega kyunki React batching karta hai aur sabke paas purana `count = 0` tha.
* **Updater Function form:** Previous state lene ke liye function pass karo:
  ```javascript
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  setCount(prev => prev + 1); // Ab count 3 badhega!
  ```

---

### Q12. Prop Drilling & Solutions?
* **Problem:** Top parent se deep child tak data pahunchane ke liye beech ke un saare components ko zabardasti prop pass karna padta hai jinhe uski zaroorat nahi hoti.
* **Solution:** Global State Management — **Context API** ya **Redux Toolkit**.

---

### Q13. `React.memo` vs `useMemo`?
* **`useMemo`:** Ek Hook hai jo component ke andar kisi **calculation / value** ko cache karta hai.
* **`React.memo`:** Ek Higher-Order Component (HOC) hai jo **POORE COMPONENT** ko wrap karta hai taaki jab tak uske **props change na hon**, wo re-render na ho.

---

### Q14. Custom Hooks?
* **Kya hai:** Ek normal JS function jo reusable stateful logic ko alag-alag components ke beech share karta hai (DRY principle).
* **Rules:**
  1. Naam hamesha `"use"` prefix se shuru hona chahiye (e.g., `useFetch`, `useAuth`).
  2. Andar React ke doosre hooks (`useState`, `useEffect`) use ho sakte hain.
  3. Logic share hota hai, state alag-alag rehti hai.

---

### Q15. Code Splitting & Lazy Loading (`React.lazy` + `Suspense`)?
* **Purpose:** Initial bundle size chhota karna taaki website turant load ho sake.
* **Working:** Pages on-demand load hote hain jab user click karta hai:
  ```jsx
  const Admin = lazy(() => import('./Admin'));

  <Suspense fallback={<div>Loading...</div>}>
    <Admin />
  </Suspense>
  ```

---

### Q16. What is an Error Boundary?
* **Problem:** React me kisi ek child component me JS error aane par poora app blank/white screen crash ho jata hai.
* **Solution:** Error Boundary ek special component hota hai jo child components ke JS errors ko catch karta hai aur poori app crash karne ki jagah ek sundar fallback UI ("Something went wrong") dikhata hai.
* **Note:** Error Boundaries sirf **Class Components** me bante hain using `componentDidCatch` aur `getDerivedStateFromError`.

# 🐬 SQL / MySQL Master Interview Guide
> **Target:** Junior Engineer Interview Preparation (31st Oct)  
> **Company:** Asaeta Pvt Ltd  
> **Topics:** Core SQL, CRUD, Joins, Keys, Aggregate Functions, Top Coding Queries & ACID

---

## 📌 Table of Contents
1. [DELETE vs TRUNCATE vs DROP](#1-delete-vs-truncate-vs-drop-)
2. [Primary Key vs Unique Key vs Foreign Key](#2-primary-key-vs-unique-key-vs-foreign-key)
3. [SQL CRUD Operations (Complete Syntax)](#3-sql-crud-operations)
4. [SQL JOINS (INNER, LEFT, RIGHT) ⭐⭐⭐](#4-sql-joins-mastery)
5. [GROUP BY vs HAVING Clause](#5-group-by-vs-having-clause)
6. [Top SQL Interview Queries (Both 2nd Highest Methods) ⭐⭐⭐](#6-top-sql-interview-queries)
7. [UNION vs UNION ALL](#7-union-vs-union-all)
8. [ACID Properties (Transactions in SQL)](#8-acid-properties)
9. [SQL Indexing Basics (Clustered vs Non-Clustered)](#9-sql-indexing-basics)

---

## 1. DELETE vs TRUNCATE vs DROP ⭐

| Feature | DELETE | TRUNCATE | DROP |
| :--- | :--- | :--- | :--- |
| **Kaam** | Specific row ya all rows delete karna | Table ka sara data khali karna | Table + Data sab delete karna |
| **WHERE Clause** | ✅ Yes (`WHERE id = 5`) | ❌ No | ❌ No |
| **Structure** | Table structure bacha rehta hai | Table structure bacha rehta hai | Table structure delete ho jata hai |
| **Rollback** | ✅ Yes (Slow, Row by row log) | ❌ No (Fast, Direct deallocate) | ❌ No |
| **Category** | DML (Data Manipulation) | DDL (Data Definition) | DDL (Data Definition) |

---

## 2. Primary Key vs Unique Key vs Foreign Key

* **Primary Key:** Table ki pehchan (Unique identity). Unique + NOT NULL. Table me sirf **EK** ho sakti hai.
* **Unique Key:** Column ki uniqueness enforce karta hai. Table me **Multiple** ho sakti hain. `NULL` allow hota hai.
* **Foreign Key:** Do tables ke beech relation banata hai. Child table me parent table ki Primary Key ko point karta hai.

---

## 3. SQL CRUD Operations

### 1. Create (`INSERT INTO`):
```sql
INSERT INTO Employees (name, city, salary)
VALUES ('Aman', 'Indore', 50000);
```

### 2. Read (`SELECT` with Filters):
```sql
-- Comparison & IN operator:
SELECT name, salary 
FROM Employees 
WHERE city IN ('Indore', 'Bhopal') AND salary > 40000;

-- Pattern Matching (LIKE):
SELECT * FROM Employees WHERE name LIKE 'A%'; -- Jinka naam 'A' se shuru ho

-- Range (BETWEEN):
SELECT * FROM Employees WHERE salary BETWEEN 30000 AND 60000;
```

### 3. Update (`UPDATE ... SET`):
```sql
UPDATE Employees
SET salary = 60000, city = 'Indore'
WHERE name = 'Aman';
```
> ⚠️ **Trap:** Bina `WHERE` clause ke query chalayi to saare employees ka data update ho jayega!

### 4. Delete (`DELETE FROM`):
```sql
DELETE FROM Employees
WHERE salary < 30000;
```

---

## 4. SQL JOINS Mastery ⭐⭐⭐

### Sample Tables:
* `Employees (emp_id, emp_name, dept_id)`
* `Departments (dept_id, dept_name)`

### 1. INNER JOIN (Matching Data Only):
Dono tables ka sirf wahi data dega jo match hota ho:
```sql
SELECT e.emp_name, d.dept_name
FROM Employees e
INNER JOIN Departments d ON e.dept_id = d.dept_id;
```

### 2. LEFT JOIN (All Left + Matching Right):
Left table ke saare employees aayenge, chahe department assign na hua ho (`NULL` aayega):
```sql
SELECT e.emp_name, d.dept_name
FROM Employees e
LEFT JOIN Departments d ON e.dept_id = d.dept_id;
```

### 3. RIGHT JOIN (All Right + Matching Left):
Right table ke saare departments aayenge, chahe us department me koi employee na ho:
```sql
SELECT e.emp_name, d.dept_name
FROM Employees e
RIGHT JOIN Departments d ON e.dept_id = d.dept_id;
```

---

## 5. GROUP BY vs HAVING Clause

* **WHERE:** Grouping hone se **PEHLE** normal rows ko filter karta hai.
* **HAVING:** Grouping hone ke **BAAD** aggregated result (`COUNT`, `SUM`, `AVG`) ko filter karta hai!

```sql
-- Har city me employees count karo, jahan 1 se zyada log hon:
SELECT city, COUNT(*) AS totalEmployees
FROM Employees
GROUP BY city
HAVING COUNT(*) > 1;
```

---

## 6. Top SQL Interview Queries

### 1. Second (ya N-th) Highest Salary Nikalna ⭐⭐⭐

#### Tarika 1: `LIMIT` & `OFFSET` (Sabse Simple aur Universal Formula)
```sql
-- 2nd Highest:
SELECT DISTINCT salary 
FROM Employees 
ORDER BY salary DESC 
LIMIT 1 OFFSET 1;

-- 3rd Highest:
SELECT DISTINCT salary 
FROM Employees 
ORDER BY salary DESC 
LIMIT 1 OFFSET 2;
```
> **Formula for N-th Highest:** `LIMIT 1 OFFSET (N - 1)`

---

#### Tarika 2: Subquery Method (Standard SQL)
```sql
SELECT MAX(salary) 
FROM Employees 
WHERE salary < (SELECT MAX(salary) FROM Employees);
```
> **Explanation:** Andar wali query `MAX(salary)` sabse badi salary nikaalti hai (e.g. 90000). Baahar wali query us 90000 se chhoti salaries me se sabse badi nikaalti hai (jo ki 2nd highest hoti hai!).

---

#### Tarika 3: Window Function (`DENSE_RANK()`) - Pro Developer Trick
```sql
SELECT salary 
FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rank_no
  FROM Employees
) AS temp
WHERE rank_no = 2; -- 👈 2nd highest ke liye 2, 3rd ke liye 3
```

---

### 2. Duplicate Records Dhundhna
```sql
-- Duplicate emails dhundho:
SELECT email, COUNT(*) AS count
FROM Users
GROUP BY email
HAVING COUNT(*) > 1;
```

---

### 3. Unmatched / Unordered Data Dhundhna
```sql
-- Wo customers jinhone kabhi koi order nahi kiya:
SELECT c.customer_name 
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
```

---

## 7. UNION vs UNION ALL

* **`UNION`:** Do queries ke result ko jodta hai aur **Duplicates ko REMOVE** kar deta hai.
* **`UNION ALL`:** Do queries ke result ko jodta hai aur **Duplicates ko RETAIN (rakhta)** hai (Fast hota hai kyunki sorting/filtering nahi karta).

```sql
SELECT city FROM Customers
UNION
SELECT city FROM Suppliers;
```

---

## 8. ACID Properties (Transaction Management)

Interviewer poochega: *"ACID properties kya hoti hain?"*

1. **A - Atomicity ("All or Nothing"):** Transaction ya to poora complete hoga ya bilkul nahi hoga (e.g. Bank se paise kate to doosre ko milne chahiye, beech me fail hua to Rollback).
2. **C - Consistency:** Database rules aur constraints (Primary key, foreign key) hamesha valid rahenge.
3. **I - Isolation:** Multiple transactions ek sath chalne par ek doosre ko disturb nahi karenge.
4. **D - Durability:** Ek baar Commit ho gaya to data permanently save rahega (chahe power cut ya server crash ho jaye).

---

## 9. SQL Indexing Basics

* **Index kyu banate hain?** Queries ko fast banane ke liye (B-Tree data structure use hota hai).
* **Clustered Index:** Table ke physical order ko define karta hai (By default **Primary Key** Clustered Index hoti hai). Table me sirf **EK** clustered index ho sakta hai.
* **Non-Clustered Index:** Kitab ke index jaisa hota hai jo actual data ke pointer ko store karta hai. Table me multiple ho sakte hain.
* **Trap:** Har column par index kyu nahi banate? Kyunki index banane se `INSERT`, `UPDATE`, `DELETE` operations **SLOW** ho jaate hain (index table update karni padti hai)!

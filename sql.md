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
10. [Real Interview Scenario-Based Queries Practice](#10-real-interview-scenario-based-queries-practice-)
11. [MySQL vs MongoDB: Complete Architectural Comparison & Decision Matrix](#11-mysql-vs-mongodb-complete-architectural-comparison--decision-matrix-)

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

### 🎯 Quick Comparison Table (Interview Ready)

| JOIN Type | Kya Return Karta Hai | NULL Kab Aata Hai |
| :--- | :--- | :--- |
| **INNER JOIN** | Sirf dono tables ka matching data | Kabhi nahi |
| **LEFT JOIN** | Left table ke saare rows + matching right | Right table mein match na ho toh `NULL` |
| **RIGHT JOIN** | Right table ke saare rows + matching left | Left table mein match na ho toh `NULL` |
| **FULL OUTER JOIN** | Dono tables ke saare rows | Jahan bhi match na ho wahan `NULL` |

---

### Sample Tables:
```
Employees:                    Departments:
emp_id | emp_name | dept_id   dept_id | dept_name
-------|----------|--------   --------|----------
1      | Aman     | 10        10      | IT
2      | Rohan    | 20        20      | HR
3      | Priya    | NULL      30      | Finance (no employee!)
```

### 1. INNER JOIN (Sirf matching data)
Dono tables ka sirf wahi data dega jo **dono mein match** hota ho:
```sql
SELECT e.emp_name, d.dept_name
FROM Employees e
INNER JOIN Departments d ON e.dept_id = d.dept_id;
```
**Output:** Aman(IT), Rohan(HR) — Priya aur Finance dono OUT ❌

---

### 2. LEFT JOIN (Left table ke saare rows)
Left table ke **saare rows** aayenge, right mein match na ho toh `NULL`:
```sql
SELECT e.emp_name, d.dept_name
FROM Employees e
LEFT JOIN Departments d ON e.dept_id = d.dept_id;
```
**Output:** Aman(IT), Rohan(HR), Priya(**NULL**) ✅
> 🎯 **Real Use Case:** Saare customers dikhao, chahe unhone order kiya ho ya na kiya ho!

---

### 3. RIGHT JOIN (Right table ke saare rows)
Right table ke **saare rows** aayenge, left mein match na ho toh `NULL`:
```sql
SELECT e.emp_name, d.dept_name
FROM Employees e
RIGHT JOIN Departments d ON e.dept_id = d.dept_id;
```
**Output:** Aman(IT), Rohan(HR), **NULL**(Finance) ✅
> 🎯 **Real Use Case:** Saare departments dikhao, chahe unme koi employee ho ya na ho!

---

### 4. FULL OUTER JOIN (Dono tables ke saare rows)
Dono tables ke **saare rows** aayenge, match na ho toh `NULL` dono taraf:
```sql
SELECT e.emp_name, d.dept_name
FROM Employees e
FULL OUTER JOIN Departments d ON e.dept_id = d.dept_id;
```
**Output:** Aman(IT), Rohan(HR), Priya(**NULL**), **NULL**(Finance) ✅
> ⚠️ **MySQL mein FULL OUTER JOIN nahi hota!** Workaround:
> ```sql
> SELECT * FROM Employees e LEFT JOIN Departments d ON e.dept_id = d.dept_id
> UNION
> SELECT * FROM Employees e RIGHT JOIN Departments d ON e.dept_id = d.dept_id;
> ```

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

---

## 10. Real Interview Scenario-Based Queries Practice ⭐⭐⭐

### Scenario 1: Group By + Aggregation (Max / Min with Filter)
> **Question:** Har `city` ki sabse badi salary (`maxSalary`) nikaalo un employees ki jinka `status = 'active'` ho.
```sql
SELECT city, MAX(salary) AS maxSalary
FROM Employees
WHERE status = 'active'
GROUP BY city
ORDER BY city ASC;
```

### Scenario 2: Group By + COUNT with Filter
> **Question:** Har `course` me kitne students hain (`studentCount`) jinhone fees bhari hai (`feesPaid = true`)?
```sql
SELECT course, COUNT(*) AS studentCount
FROM Students
WHERE feesPaid = true
GROUP BY course;
```

### Scenario 3: Filter on Aggregated Data (HAVING Clause)
> **Question:** Wo customers dhundho jinke "completed" orders ka total amount `2000` se zyada ho.
```sql
SELECT customer, SUM(amount) AS totalAmount
FROM Orders
WHERE status = 'completed'
GROUP BY customer
HAVING SUM(amount) > 2000;
```

---

## 11. MySQL vs MongoDB: Complete Architectural Comparison & Decision Matrix ⭐⭐⭐

### Quick Comparison Table:
| Feature | MySQL (RDBMS / SQL) | MongoDB (Document / NoSQL) |
| :--- | :--- | :--- |
| **Data Format** | Tables, Rows & Columns | Collections & JSON Documents (BSON) |
| **Schema** | **Strict & Fixed** (Predefined structure) | **Dynamic & Flexible** (Schema-less) |
| **Relationships** | Heavy **Foreign Keys & Joins** (`INNER/LEFT`) | **Embedded Documents** ya `$lookup` |
| **Transactions** | **100% ACID Compliant** by default (InnoDB) | Multi-document ACID supported, best for high-throughput writes |
| **Scaling** | **Vertical Scaling** (CPU/RAM upgrade) | **Horizontal Scaling** (Sharding across clusters) |
| **Query Language** | SQL Syntax (`SELECT * FROM...`) | JavaScript Object Query / Aggregation Pipeline |

---

### 🎯 Kab Kaunsa Database Use Karein? (Decision Guide)

#### A. MySQL KAB CHOOSE KAREIN?
1. **Financial & Payment Data (ACID Compliance):** Jahan 1 paise ya 1 unit inventory ka bhi mismatch allow nahi hota (Bank transactions, payment gateways, e-commerce checkout).
2. **Complex Relational Data (RBAC / ERP):** Jahan entities ke beech heavy relationships hon (Users <-> Roles <-> Permissions). Foreign Keys se `CASCADE ON DELETE` aur data integrity enforce hoti hai.
3. **Fixed, Structured Schema:** Jahan data ka structure predefined ho aur bar-bar schema badalne ki zaroorat na ho.

#### B. MongoDB KAB CHOOSE KAREIN?
1. **Dynamic & Evolving Catalogs:** E-commerce multi-vendor portals jahan har product category ke attributes alag hon (Shoes vs Electronics vs Fashion).
2. **High-Speed Bulk Writes & Logging:** IoT device logs, real-time activity streams, clickstream tracking jahan thousands of writes per second chahiye hon.
3. **Native Nested JSON APIs:** Third-party APIs (Shopify APIs, Stripe webhooks) se deeply nested JSON data direct store karne ke liye bina Object-Relational mapping ke (Jaise TPP me).
4. **Rapid Prototyping (MVPs):** Bina table migration scripts ke tezi se feature build karne ke liye.

> 🎯 **Interview Answer (45-Sec Pitch):**
> *"Sir, hum **MySQL** tab choose karte hain jab data structured ho, entities ke beech strict relationships hon, aur **ACID transactions** top priority hon (jaise Banking, Payments aur RBAC Inventory). Aur hum **MongoDB** tab use karte hain jab data dynamic ya nested JSON ho, schema bar-bar evolve ho raha ho, aur hume **high write speed aur horizontal scaling** chahiye ho (jaise E-commerce multi-vendor sync TPP me ya real-time logging me)."*



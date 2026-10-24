# 🍃 MongoDB 2-Year Experience: Complete Preparation Guide
> **Purpose:** Ye guide 2 saal ke experience wale developers ke liye complete interview reference hai jisme **Part 1: CRUD Operations** aur **Part 2: Aggregation Pipeline** dono ke Before/After outputs aur interview traps shaamil hain.

---

## 📌 Table of Contents

### Part 1: CRUD & Advanced Operators
1. [Core Comparison & Logical Operators](#1-comparison--logical-operators)
2. [Regex Search (Search Bar & Case-Insensitive)](#2-regex-search-search-bar)
3. [Nested Documents (Dot Notation)](#3-nested-documents-dot-notation)
4. [Arrays: Exact Match vs $in vs $all](#4-arrays-exact-match-vs-in-vs-all)
5. [Array of Objects: Normal vs $elemMatch ⭐](#5-array-of-objects-normal-vs-elemmatch-)
6. [Projection: Field Selection & $slice](#6-projection-field-selection--slice)
7. [Update Operators with Before/After Output ($set, $unset, $inc, $push, $addToSet, $pull)](#7-update-operators-with-beforeafter-output)
8. [Positional Operators ($ vs $[elem]) with Before/After Output](#8-positional-operators--vs-elem)
9. [findOneAndUpdate vs updateOne (returnDocument: "after")](#9-findoneandupdate-vs-updateone)
10. [Upsert & $setOnInsert](#10-upsert--setoninsert)
11. [Delete Operations (deleteOne, deleteMany, findOneAndDelete)](#11-delete-operations)
12. [Sorting & Pagination (skip, limit, & Scalability Trap)](#12-sorting--pagination)

### Part 2: Aggregation Pipeline Framework
13. [Pipeline Concept & Golden Rules](#13-aggregation-pipeline-concept--golden-rules)
14. [$match + $group (Grouping, Sum, Avg, Count)](#14-match--group-grouping-analytics)
15. [$unwind (Flattening Arrays & Traps) ⭐](#15-unwind-flattening-arrays--traps)
16. [$lookup (Left Outer Joins & $lookup + $unwind Combo) ⭐⭐](#16-lookup-joins-in-mongodb)
17. [$project vs $addFields (Reshape vs Preserve)](#17-project-vs-addfields)
18. [$facet (Multi-Faceted Search & Pagination + Count in 1 Query) ⭐⭐⭐](#18-facet-parallel-sub-pipelines)
19. [$cond (If-Else Conditions in Aggregation)](#19-cond-if-else-logic)
20. [The 100MB RAM Limit & allowDiskUse: true](#20-the-100mb-ram-limit--allowdiskuse)

---

## 0. Hamara Master Sample Document

Hum is document ka use karenge compare karne ke liye:

```json
{
  "_id": 101,
  "name": "Aman",
  "age": 26,
  "skills": ["JavaScript", "Node.js", "MongoDB"],
  "address": { "city": "Pune", "pincode": 411001 },
  "certifications": [
    { "title": "AWS Cloud", "year": 2023, "score": 85 },
    { "title": "MongoDB Developer", "year": 2024, "score": 92 }
  ],
  "isActive": true
}
```

---

# PART 1: CRUD & ADVANCED OPERATORS

## 1. Comparison & Logical Operators
* `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`
* `$and` (comma `,` by default AND hota hai), `$or`, `$nor`, `$not`

```javascript
db.users.find({
  age: { $gte: 20, $lte: 30 },
  "address.city": { $in: ["Pune", "Mumbai"] }
})
```

---

## 2. Regex Search (Search Bar)
```javascript
// 'i' flag = Case-insensitive (Small/Capital letter ignore karega)
db.users.find({
  name: { $regex: "aman", $options: "i" }
})
// Shortcut:
db.users.find({ name: /aman/i })
```

---

## 3. Nested Documents (Dot Notation)
```javascript
// Nested field me hamesha quotes "" aayenge:
db.users.find({
  "address.city": "Pune",
  "address.pincode": 411001
})
```

---

## 4. Arrays: Exact Match vs $in vs $all
```javascript
// Exact array match (Order matter karta hai - Interview Trap!):
db.users.find({ skills: ["Node.js", "MongoDB"] }) // ❌ Won't match if JavaScript is also present

// Any one matches (OR):
db.users.find({ skills: { $in: ["Python", "Node.js"] } })

// All must be present (AND):
db.users.find({ skills: { $all: ["JavaScript", "MongoDB"] } })
```

---

## 5. Array of Objects: Normal vs $elemMatch ⭐
```javascript
// ❌ Trap: Alag-alag elements match karke galat result deta hai:
db.users.find({ "certifications.title": "AWS Cloud", "certifications.score": { $gte: 90 } })

// ✅ Sahi ($elemMatch): SAME single object ke andar dono conditions check karega:
db.users.find({
  certifications: {
    $elemMatch: { title: "MongoDB Developer", score: { $gte: 90 } }
  }
})
```

---

## 6. Projection: Field Selection & $slice
```javascript
// 1 = Include, 0 = Exclude (mix allowed nahi hai, except _id: 0)
db.users.find({ "address.city": "Pune" }, { name: 1, age: 1, _id: 0 })

// $slice: Array ke pehle 2 items hi return karo:
db.users.find({ _id: 101 }, { name: 1, certifications: { $slice: 2 } })
```

---

## 7. Update Operators with Before/After Output

### 1. `$set` (Value badalna ya naya field add karna)
```javascript
db.users.updateOne({ _id: 101 }, { $set: { "address.city": "Bangalore" } })
```
* **BEFORE:** `"address": { "city": "Pune", "pincode": 411001 }`
* **AFTER:**  `"address": { "city": "Bangalore", "pincode": 411001 }`

### 2. `$unset` (Field ko database se DELETE karna)
```javascript
db.users.updateOne({ _id: 101 }, { $unset: { isActive: "" } })
```
* **BEFORE:** `"isActive": true`
* **AFTER:**  `isActive` field permanently gayab ho gaya.

### 3. `$inc` (Number badhana ya ghatana)
```javascript
db.users.updateOne({ _id: 101 }, { $inc: { age: 1 } }) // Ghatana ho to -1
```
* **BEFORE:** `"age": 26`
* **AFTER:**  `"age": 27`

### 4. `$push` (Array me item add karna - Duplicates allowed)
```javascript
db.users.updateOne({ _id: 101 }, { $push: { skills: "Docker" } })
```
* **BEFORE:** `"skills": ["JavaScript", "Node.js", "MongoDB"]`
* **AFTER:**  `"skills": ["JavaScript", "Node.js", "MongoDB", "Docker"]`

### 5. `$addToSet` (Array me item add karna - NO Duplicates) ⭐
```javascript
db.users.updateOne({ _id: 101 }, { $addToSet: { skills: "Node.js" } })
```
* **AFTER:** Kuch change nahi hua kyunki "Node.js" pehle se tha!

### 6. `$pull` (Array se element DELETE karna)
```javascript
db.users.updateOne({ _id: 101 }, { $pull: { skills: "JavaScript" } })
```
* **BEFORE:** `"skills": ["JavaScript", "Node.js", "MongoDB", "Docker"]`
* **AFTER:**  `"skills": ["Node.js", "MongoDB", "Docker"]`

---

## 8. Positional Operators (`$` vs `$[elem]`)

### 1. Positional Operator `$` (Single Matched Element)
```javascript
db.users.updateOne(
  { _id: 101, "certifications.title": "MongoDB Developer" },
  { $set: { "certifications.$.score": 95 } }
)
```
* **AFTER:** MongoDB Developer ka score 92 se badh kar 95 ho gaya!

### 2. Filtered Positional Operator `$[elem]` (Multiple Elements)
```javascript
db.users.updateOne(
  { _id: 101 },
  { $set: { "certifications.$[elem].score": 90 } },
  { arrayFilters: [ { "elem.score": { $lt: 90 } } ] }
)
```
* **AFTER:** AWS Cloud ka score 85 se badhkar 90 ho jayega!

---

## 9. `findOneAndUpdate` vs `updateOne`
```javascript
db.users.findOneAndUpdate(
  { _id: 101 },
  { $set: { age: 28 } },
  { returnDocument: "after" } // 👈 Updated document pane ke liye
)
```
> **Mongoose Tip:** Mongoose me `{ new: true }` likhte hain, MongoDB native driver me `{ returnDocument: "after" }`!

---

## 10. Upsert & `$setOnInsert`
```javascript
db.users.updateOne(
  { name: "Rohan" },
  {
    $set: { age: 24, "address.city": "Delhi" },
    $setOnInsert: { createdAt: new Date() } // Sirf INSERT hone par chalta hai
  },
  { upsert: true }
)
```

---

## 11. Delete Operations
```javascript
db.users.deleteOne({ _id: 101 })
db.users.deleteMany({ isActive: false })
const deletedDoc = db.users.findOneAndDelete({ _id: 101 }) // Delete + return document
```

---

## 12. Sorting & Pagination
```javascript
db.users.find().sort({ age: -1, name: 1 }).skip(10).limit(10)
```
> **Scalability Trap:** 10M records par `.skip(5000000)` memory crash kar dega. Hamesha **Keyset Pagination** use karo:
> `db.users.find({ _id: { $gt: lastSeenId } }).limit(10)`

---

# PART 2: AGGREGATION PIPELINE FRAMEWORK

## 13. Aggregation Pipeline Concept & Golden Rules

```
[ Documents ] ➔ Stage 1 ($match) ➔ Stage 2 ($group) ➔ Stage 3 ($project) ➔ [ Output ]
```

### 3 Golden Rules:
1. **Har Stage ka apna alag `{}` object hota hai:** `[ { $match: ... }, { $group: ... } ]`.
2. **`$group` me `_id` MANDATORY hai:** `_id: "$category"` ya poore collection ka total ke liye `_id: null`.
3. **Fields ko access karne ke liye `$` aur Quotes lagate hain:** `"$price"`, `"$category"`.

---

## 14. `$match` + `$group` (Grouping & Analytics)

Hamare paas `orders` collection hai:
```json
[
  { "_id": 1, "customer": "Aman", "category": "Electronics", "amount": 1200, "status": "completed" },
  { "_id": 2, "customer": "Rohan", "category": "Electronics", "amount": 800, "status": "completed" },
  { "_id": 3, "customer": "Aman", "category": "Fashion", "amount": 1500, "status": "completed" }
]
```

### Query:
```javascript
db.orders.aggregate([
  {
    $match: { status: "completed" }
  },
  {
    $group: {
      _id: "$category",
      totalRevenue: { $sum: "$amount" },
      avgRevenue: { $avg: "$amount" },
      orderCount: { $sum: 1 }
    }
  }
])
```

#### 📦 Output:
```json
[
  { "_id": "Electronics", "totalRevenue": 2000, "avgRevenue": 1000, "orderCount": 2 },
  { "_id": "Fashion", "totalRevenue": 1500, "avgRevenue": 1500, "orderCount": 1 }
]
```

---

## 15. `$unwind` (Flattening Arrays & Traps) ⭐

Array ko khol kar flatten (deconstruct) karta hai:

```json
// BEFORE: 1 Document
{ "_id": 1, "customer": "Aman", "items": ["Laptop", "Mouse"] }
```

```javascript
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items",
      totalSold: { $sum: 1 }
    }
  }
])
```

### ⚠️ Trap: Agar array khali `[]` ho:
Khaali array hone par `$unwind` document delete kar deta hai. Usse bachane ke liye:
```javascript
{
  $unwind: {
    path: "$items",
    preserveNullAndEmptyArrays: true // 👈 Document safe rahega
  }
}
```

---

## 16. `$lookup` (Joins in MongoDB) ⭐⭐

SQL ke **LEFT OUTER JOIN** ki tarah kaam karta hai:

```javascript
db.authors.aggregate([
  {
    $lookup: {
      from: "books",           // 1. Kis collection se join karna hai
      localField: "_id",        // 2. authors ka _id
      foreignField: "authorId", // 3. books ka matching field
      as: "authorBooks"         // 4. Output array ka naam
    }
  }
])
```

### 🎯 The `$lookup` + `$unwind` Combo (1-to-1 Relations):
`$lookup` hamesha array deta hai. Agar relationship 1:1 ho aur clean object chahiye:
```javascript
db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" } // 👈 Array [] hatakar single object {} bana deta hai
])
```

---

## 17. `$project` vs `$addFields`

| Operator | Kaam Kya Karta Hai? | Best Use Case |
| :--- | :--- | :--- |
| **`$project`** | Sirf wahi fields output me aayenge jo explicitly mention kiye hon. Baki sab DROP ho jaate hain. | Sensitive fields (password, phone) hatana, fields rename karna. |
| **`$addFields`** | Saare existing fields waise ke waise bache rehte hain, bas naya field add ho jata hai. | Total price calculate karna bina purana data lose kiye. |

```javascript
// Example: Full name banana aur baki fields drop karna:
db.users.aggregate([
  {
    $project: {
      _id: 1,
      fullName: { $concat: ["$firstName", " ", "$lastName"] }
    }
  }
])
```

---

## 18. `$facet` (Parallel Sub-pipelines) ⭐⭐⭐

Ek hi query me **Paginated Data** aur **Total Count** parallel me laana:

```javascript
db.products.aggregate([
  {
    $facet: {
      // Sub-pipeline 1: Page data
      "productsList": [
        { $skip: 0 },
        { $limit: 10 }
      ],
      // Sub-pipeline 2: Total count
      "totalRecords": [
        { $count: "count" }
      ]
    }
  }
])
```
*Note: `"productsList"` aur `"totalRecords"` hamare custom alias/key names hain.*

---

## 19. `$cond` (If-Else Logic)

Aggregation me Ternary Operator (`? :`):

```javascript
db.students.aggregate([
  {
    $project: {
      name: 1,
      marks: 1,
      result: {
        $cond: {
          if: { $gte: ["$marks", 40] },
          then: "Pass",
          else: "Fail"
        }
      }
    }
  }
])

// Shorthand Array Syntax:
// result: { $cond: [ { $gte: ["$marks", 40] }, "Pass", "Fail" ] }
```

---

## 20. The 100MB RAM Limit & `allowDiskUse: true`

* **Problem:** Kisi bhi aggregation stage ke liye memory limit **100 MB** hoti hai.
* **Solution:** Large data par query crash hone se bachane ke liye `{ allowDiskUse: true }` lagate hain:

```javascript
db.orders.aggregate(
  [
    { $group: { _id: "$customer", total: { $sum: "$amount" } } },
    { $sort: { total: -1 } }
  ],
  { allowDiskUse: true } // 👈 Hard disk temp storage use karega
)
```

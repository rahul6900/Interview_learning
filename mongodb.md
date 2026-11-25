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
21. [Real-World Aggregation Scenarios](#21-real-world-scenarios-mastery)
22. [Bulk Operations: insertMany vs bulkWrite](#22-bulk-operations-insertmany-vs-bulkwrite--crud-optimization-)
23. [MongoDB Migrations & Zero-Downtime Schema Evolution ⭐⭐⭐](#23-mongodb-database-migrations--zero-downtime-schema-evolution-)

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

### 🎯 Interview Answer: Key Difference

| Feature | `updateOne` | `findOneAndUpdate` |
| :--- | :--- | :--- |
| **Kaam** | Sirf document update karta hai | Update karta hai **+ updated document return** karta hai |
| **Return Value** | `{ matchedCount: 1, modifiedCount: 1 }` | Updated document khud |
| **Kab use karein** | Jab sirf update karna ho, document ki zaroorat nahi | Jab update ke baad naya data UI pe dikhana ho (e.g. profile update) |

### Example:
```javascript
// updateOne — sirf update, document nahi milta
db.users.updateOne({ _id: 101 }, { $set: { age: 28 } })
// Returns: { matchedCount: 1, modifiedCount: 1 }

// findOneAndUpdate — update + naya document milta hai
db.users.findOneAndUpdate(
  { _id: 101 },
  { $set: { age: 28 } },
  { returnDocument: "after" } // 👈 Updated document pane ke liye
)
// Returns: { _id: 101, name: "Aman", age: 28, ... }
```
> **Mongoose Tip:** Mongoose me `{ new: true }` likhte hain, MongoDB native driver me `{ returnDocument: "after" }`!
> **Real Use Case:** User ne profile update kiya → updated profile card UI pe dikhao → `findOneAndUpdate` use karo!

---

## 10. Upsert & `$setOnInsert`

### 🎯 Interview Answer: Upsert kya hota hai?
**Upsert = Update + Insert**
- Document **milta hai** → Update kar do
- Document **nahi milta** → Naya Insert kar do
- Ek hi query mein dono kaam! No need to check first.

### Real Use Case:
User login kiya → pehli baar hai to naya document banao, warna sirf `lastLogin` update karo:

```javascript
db.users.updateOne(
  { name: "Rohan" },                          // 1. Dhundo
  {
    $set: { age: 24, "address.city": "Delhi" }, // 2. Update karo (ya insert mein bhi lagega)
    $setOnInsert: { createdAt: new Date() }     // 3. Sirf INSERT hone par chalta hai
  },
  { upsert: true }                             // 4. Nahi mila? Insert kar do!
)
```

> **`$setOnInsert`:** Sirf tab chalta hai jab document **naya insert** hota hai. Update hone par yeh field ignore ho jaati hai!
> **Real Use Case:** User ka pehla login → `createdAt` set karo. Dobara login → sirf `lastLogin` update karo. Ek hi query!

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

### ⚡ Interview Favorite: `find()` vs `aggregate()` Difference

| Feature | `find()` | `aggregate()` |
| :--- | :--- | :--- |
| **Primary Purpose** | Simple Retrieval & Filtering (Basic CRUD) | Complex Data Processing, Analytics & Transformation |
| **How it Works** | Database se documents filter karke as-it-is le aana | Pipeline architecture (ek stage ka output agle stage ka input banta hai) |
| **Grouping & Aggregation** | ❌ Nahi kar sakta (e.g., Sum, Average, Min, Max calculate nahi kar sakta) | ✅ Easily kar sakta hai using `$group`, `$sum`, `$avg`, etc. |
| **Joins ($lookup)** | ❌ Do collections ko join nahi kar sakta | ✅ `$lookup` ke through multi-collection join kar sakta hai |
| **Data Reshaping** | Sirf field include/exclude kar sakta hai (`projection`) | Calculation karke nayi fields generate kar sakta hai (`$project`, `$addFields`, `$cond`) |
| **Memory Limit** | Documents direct stream hote hain cursor ke through | Default 100MB RAM limit per stage (can use `allowDiskUse: true`) |
| **Performance** | Simple queries ke liye faster & lighter | Processing overhead hota hai, but complex tasks database layer par hi nipta deta hai |

#### 💡 One-Liner for Interviewer:
> *"Sir, `find()` is used for simple retrieval, filtering, and projecting existing documents. While `aggregate()` is a multi-stage pipeline used for advanced data processing like grouping, transformations, calculations (sum/avg), and joining multiple collections using `$lookup`."*

---

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

---

## 21. Real Interview Scenario-Based Aggregation Practice ⭐⭐⭐

### Scenario 1: Category-wise Max/Min Price (With Filter)
> **Question:** Har `category` ka sabse sasta product (`minPrice`) nikaalo jinka `inStock: true` ho.
```javascript
db.products.aggregate([
  { $match: { inStock: true } },
  {
    $group: {
      _id: "$category",
      minPrice: { $min: "$price" }
    }
  }
])
```

### Scenario 2: Count per Group (Students in Course)
> **Question:** Har `course` me kitne students hain (`studentCount`) jinhone fees bhari hai (`feesPaid: true`)?
```javascript
db.students.aggregate([
  { $match: { feesPaid: true } },
  {
    $group: {
      _id: "$course",
      studentCount: { $sum: 1 } // 👈 Har matching document ke liye +1 count
    }
  }
])
```

### Scenario 3: Filter + Group + Having (Customer Total > 2000)
> **Question:** Wo customers dhundho jinke "completed" orders ka total amount `2000` se zyada ho.
```javascript
db.orders.aggregate([
  { $match: { status: "completed" } },
  {
    $group: {
      _id: "$customer",
      totalAmount: { $sum: "$amount" }
    }
  },
  { $match: { totalAmount: { $gt: 2000 } } } // 👈 SQL ke HAVING jaisa kaam karta hai
])
```

---

## 22. Bulk Operations: `insertMany()` vs `bulkWrite()` & CRUD Optimization ⭐⭐⭐

### 1. `insertMany()` (Bulk Insert Only)
Jab ek sath hazaron **naye documents** insert karne hon bina loop chalaye:
```javascript
const newProducts = [
  { title: "Shoes", price: 2000, sku: "SH-01" },
  { title: "Watch", price: 5000, sku: "WT-02" }
];

await Product.insertMany(newProducts);
```
* **Limit:** Sirf INSERT operation kar sakta hai. Update ya Delete nahi.

---

### 2. `bulkWrite()` (Heterogeneous Batching: Insert + Update + Delete Together) ⭐⭐⭐
`bulkWrite()` ek hi single network request me alag-alag tarah ke operations batch karke execute karta hai:
* `insertOne`
* `updateOne` / `updateMany`
* `deleteOne` / `deleteMany`
* `replaceOne`

#### 🎯 Real Project Use Case (The Privya Pursuit - TPP Hourly Sync):
Hourly cron sync me supplier se kuch naye products aate hain (Insert), kuch purano ka stock badalta hai (Update), aur kuch discontinue hote hain (Delete). In sabko 1 single call me execute karne ke liye `bulkWrite` use hota hai:

```javascript
await Product.bulkWrite([
  // 1. Naya product add karo:
  {
    insertOne: {
      document: { title: "T-Shirt", price: 999, sku: "TS-10", stock: 50 }
    }
  },
  // 2. Existing product ka stock & price update karo:
  {
    updateOne: {
      filter: { sku: "SH-01" },
      update: { $set: { stock: 15, price: 1899 } },
      upsert: true // Agar na mile toh create kar do
    }
  },
  // 3. Out-of-catalog product delete karo:
  {
    deleteOne: {
      filter: { sku: "OLD-DISCONTINUED-99" }
    }
  }
]);
```

### 📊 Quick Comparison:
| Feature | `insertMany()` | `bulkWrite()` |
| :--- | :--- | :--- |
| **Allowed Operations** | Sirf **INSERT** | **Insert, Update, Delete, Upsert** sab mix |
| **Performance** | Fast for pure data upload | **Super-Fast for Inventory Sync / Complex batching** |
| **Payload Structure** | Plain documents ka array `[{...}, {...}]` | Operation objects ka array `[{ insertOne: ... }, { updateOne: ... }]` |

---

### 3. Production CRUD Optimization Checklist:
1. **Indexing:** Search/Sort wale fields par B-Tree indexes (`sku`, `category`).
2. **`.lean()`:** Mongoose overhead hatane ke liye read queries par `.lean()` use karo (50% less RAM).
3. **Projection (`.select('title price')`):** Sirf zaroori fields fetch karo.
4. **Keyset Pagination:** `.skip()` ki jagah `{ _id: { $gt: lastSeenId } }` use karo.
5. **Connection Pooling:** `maxPoolSize: 50` concurrent connections ke liye.

---

## 23. MongoDB Database Migrations & Zero-Downtime Schema Evolution ⭐⭐⭐

### 1. MongoDB Migration Kya Hota Hai? (NoSQL me kyu zaroorat hai?)
Beginners sochte hain: *"MongoDB to schema-less hai, toh migration kyu chahiye?"*
* **The Reality:** MongoDB schema-less hai, lekin hamara **Node.js / React Application Code schema-less nahi hai!** Code specific fields (`user.phone`, `order.total`) expect karta hai.
* **Definition:** Jab business requirements badalti hain ya schema evolve hota hai, toh production me pade **existing hazaron/laakhon documents ke data format ko naye structure me transform karne ko "Database Migration" bolte hain.**

---

### 2. The Real Production Problem (Code Crash Trap 💥):
* **Scenario:** Developer A ka code `user.phoneNumber` expect kar raha tha (`user.phoneNumber.slice(0, 5)`).
* Developer B ya naye business requirement ne field ko rename karke `user.contactNumber` kar diya.
* **Result:** Purane code ko `undefined` milega aur application live production me crash ho jayegi:
  `TypeError: Cannot read properties of undefined (reading 'slice')`

---

### 3. Solution: "Expand and Contract" Pattern (Zero-Downtime Release)
Production me kisi bhi field ko ek jhatke me delete ya direct rename nahi karte. Ye 3 phases me hota hai:

#### Phase 1: Expand (Both Fields Supported)
* Nayi field (`contactNumber`) introduce karo, lekin purani field (`phoneNumber`) ko delete **mat karo**.
* Write operations dono fields me data save karein.
* Read operations me fallback rakho:
  ```javascript
  const phone = user.contactNumber || user.phoneNumber || "";
  const safePhone = phone?.slice(0, 10); // Optional Chaining to prevent crash
  ```

#### Phase 2: Migrate (Database Data Transformation)
* Ek background migration script chalao jo saare purane documents ko naye format me sync kare.

#### Phase 3: Contract (Cleanup)
* Jab saare microservices aur APIs naye field (`contactNumber`) par shift ho jayein, tab purani field (`phoneNumber`) ko database se safely remove karo (`$unset`).

---

### 4. Smart Mongoose Solution: Virtual Fields ⭐
Agar database me field change ho chuki hai, par aap chahte ho ki kisi ka purana code na phate, toh Mongoose me **Virtual Field** bana do:

```javascript
// Database me field hai: contactNumber
userSchema.virtual('phoneNumber').get(function() {
  return this.contactNumber; // Purana code 'phoneNumber' mangega toh use 'contactNumber' mil jayega
});
```

---

### 5. Migration Tools in Node.js: `migrate-mongo`
Production me migration files likhi jaati hain jisme 2 functions hote hain:
1. **`up()`:** Naya change apply karne ke liye.
2. **`down()`:** Deployment fail hone par Rollback karne ke liye.

```javascript
// migrations/20261125_rename_phone_field.js
module.exports = {
  async up(db) {
    // Apply changes:
    await db.collection('users').updateMany(
      {},
      { $rename: { 'phoneNumber': 'contactNumber' } }
    );
  },

  async down(db) {
    // Rollback changes (agar production me bug aa jaye):
    await db.collection('users').updateMany(
      {},
      { $rename: { 'contactNumber': 'phoneNumber' } }
    );
  }
};
```

---

### 6. 10 Million Records Migration Trap (Batching Rule) ⭐⭐⭐
* **Trap:** 1 Crore documents par direct `updateMany()` chalane se database lock ho jayega aur live users ko timeout errors aane lagenge.
* **Best Practice:** Hamesha chunking / batching (5000 records at a time) use karo:
  ```javascript
  const cursor = db.users.find({ contactNumber: { $exists: false } }).batchSize(5000);
  // Loop through batches and update using bulkWrite()
  ```

---

### 🗣️ Interview Golden One-Liner:
> *"Sir, while MongoDB is schemaless, our application code expects a strict structure. When requirements change, we perform MongoDB Migrations using tools like `migrate-mongo` with `up()` and `down()` rollback scripts. To prevent production crashes during field renames, we follow the **Expand & Contract pattern** with defensive fallbacks (`user.newField || user.oldField`), Mongoose virtuals, and batch our updates to ensure zero database lock."*




// Run this script in mongosh using: load("setup_db.js")
// Or copy-paste directly into your mongosh shell

db = db.getSiblingDB("interview_db")

db.users.drop()
db.orders.drop()

// 1. Users Collection Insert karo:
db.users.insertMany([
  {
    _id: 101,
    name: "Aman Sharma",
    age: 26,
    walletBalance: 500,
    skills: ["JavaScript", "Node.js", "MongoDB"],
    address: { city: "Delhi", pincode: 110001 },
    certifications: [
      { title: "AWS Cloud", year: 2023, score: 85 },
      { title: "MongoDB Developer", year: 2024, score: 92 }
    ],
    isActive: true
  },
  {
    _id: 102,
    name: "Rohan Verma",
    age: 22,
    walletBalance: 1200,
    skills: ["Python", "Django"],
    address: { city: "Mumbai", pincode: 400001 },
    certifications: [
      { title: "Python Specialist", year: 2023, score: 78 }
    ],
    isActive: false
  },
  {
    _id: 103,
    name: "Priya Singh",
    age: 28,
    walletBalance: 2500,
    skills: ["Java", "Spring Boot", "React"],
    address: { city: "Delhi", pincode: 110005 },
    certifications: [
      { title: "Java Architect", year: 2022, score: 95 },
      { title: "AWS Cloud", year: 2024, score: 91 }
    ],
    isActive: true
  }
])

// 2. Orders Collection Insert karo:
db.orders.insertMany([
  { _id: 1, userId: 101, category: "Electronics", items: ["Laptop", "Mouse"], totalAmount: 52000, status: "delivered" },
  { _id: 2, userId: 101, category: "Electronics", items: ["Keyboard"], totalAmount: 1500, status: "delivered" },
  { _id: 3, userId: 102, category: "Fashion", items: ["Shoes", "Jacket"], totalAmount: 4500, status: "delivered" },
  { _id: 4, userId: 103, category: "Electronics", items: ["Headphones"], totalAmount: 3000, status: "cancelled" },
  { _id: 5, userId: 103, category: "Fashion", items: ["Watch"], totalAmount: 7000, status: "delivered" }
])

print("✅ Data successfully inserted into interview_db!")

# 📚 InfoNest – Library Management System

InfoNest is a full-stack web application for managing a library’s catalog, members, lending activity, and fines—built from the ground up using **Node.js, Express, MySQL (XAMPP), and HTML/CSS/JavaScript**. The system supports librarian authentication, member and book management, lending workflows, fines tracking, and reporting.

---

## 🚀 Features

### 👤 Authentication
- Secure login for librarian (`librarian@library.com` / `SecureLib@123`)
- Password stored with bcrypt hashing

### 👥 Member Management
- Add, update, view, and inactivate members
- Auto-tracked membership date and status
- Soft deletion with safeguards against active loans or unpaid fines
- Validation to prevent duplicate emails/phones

### 📚 Book Management
- Manage book metadata (ISBN, Title, Author, etc.)
- Track individual book copies via barcode
- Copy status: Available, Borrowed, Lost
- Prevent metadata deletion if copies still exist

### 📅 Lending System
- Assign specific book copies to members
- Auto-calculate 14-day due date
- Prevent returns if unpaid fines exist
- Track lending history per copy and per member

### 💸 Fines
- Track $1/day overdue fines
- Record, update, and mark fines as paid
- Prevent further transactions for members with unpaid fines

### 📊 Reports
- Overdue loans with visual highlights
- List of unpaid fines
- Individual member borrowing history
- Export to CSV and print-friendly layouts

### 🌈 UI/UX
- Glassmorphism design with mobile-first responsiveness
- Admin features protected by login state

---

## 🛠️ Tech Stack

| Layer      | Tech                     |
|------------|--------------------------|
| Frontend   | HTML, CSS, JavaScript    |
| Backend    | Node.js, Express         |
| Database   | MySQL via XAMPP          |
| Security   | bcryptjs (for hashing)   |
| Styling    | Responsive,              |

---

## 📂 Folder Structure
InfoNest-Backend/ ├── controllers/ # Business logic ├── models/ # DB queries ├── routes/ # API routes ├── middleware/ # Auth logic ├── utils/ # Hashing, etc. ├── .env # DB credentials └── server.js # Entry point

InfoNest-Frontend/ ├── index.html ├── style.css └── script.js

---

## ⚙️ Setup Instructions

### 1. Backend
```bash
cd InfoNest-Backend
npm install
npm run dev

---
Configure .env with your XAMPP MySQL credentials

Import database schema 

2. Frontend
Open index.html in your browser via Live Server (VS Code) or localhost


---
📝 License
This project was developed as part of a coding challenge. You're free to use the architecture as a learning reference or extend it for personal/academic projects.

💬 Author
Tadiwanashe Naruza – A Full-stack dev in the making, passionate about building smart, scalable systems which so;ve real world problems.

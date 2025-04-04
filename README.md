# 💰 Finance Tracker

A simple and intuitive personal finance tracking application built with **React**, **TypeScript**, and **Node.js**.


---

## 🌟 Features

- 🔐 User authentication (login/register)
- 📊 Dashboard with financial overview
- ➕ Track income and expenses
- 🗂️ Categorize transactions
- 📈 Visualize spending patterns
- 🔒 Secure data storage

---

## 📋 Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/) (for cloning the repository)

---

## 🚀 Installation Guide

Follow these steps to set up the Finance Tracker on your local machine:

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/neyy20/pbl-finance-tracker.git
cd pbl-finance-tracker

### 2️⃣ Install Dependencies

Install client dependencies:

```bash
cd client
npm install
```
Install server dependencies:

```bash
cd server
npm install
```

### 3️⃣ Configure Environment Variables

Create a .env file in the client directory and add your environment variables:

```bash
cd ../client
touch .env
```

Add your environment variables to the .env file:

```bash
REACT_APP_API_URL=http://localhost:3000
```

### 4️⃣ Start the Server

Start the server:

```bash
cd ../server
npm start
```

### 5️⃣ Start the Client

Start the client:

```bash
cd ../client
npm start
```

### 6️⃣ Open in Browser

Open your browser and navigate to http://localhost:5173 to view the application.


## 💻 Usage Guide

### 📝 Register a New Account

- Click **"Sign Up"**
- Fill in **username**, **email**, and **password**
- Click **"Create Account"**

### 🔐 Log In

- Enter your credentials
- Click **"Sign In"**

### 📊 Dashboard Overview

- View your **balance** and **recent transactions**

### ➕ Add a Transaction

- Click **"Add Transaction"**
- Choose type: **income** or **expense**
- Fill in **amount**, **category**, and optional **description**
- Click **"Save"**

### 📈 View Reports

- Navigate to **"Reports"**
- Analyze your **spending by category**
- Track **monthly trends**

### 👥 Contributors

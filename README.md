# TripMate - Group Expense Tracker

A full-stack web application designed to help groups of friends track shared expenses and seamlessly calculate who owes whom. Built with the MERN stack, this application features a custom pairwise netting algorithm to generate optimized settlement plans.

## Features
* **Secure Authentication:** User signup, login, and OTP-based password recovery via email.
* **Group Management:** Add or remove group members dynamically.
* **Expense Tracking:** Record payments with details on who paid, the amount, and the purpose.
* **Optimized Settlements:** Automatically calculates net balances and generates the simplest, most efficient payment plan to settle all debts.
* **History Log:** View a chronological history of all group expenses.

## Tech Stack
* **Frontend:** React.js (Vite), Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication & Security:** JSON Web Tokens (JWT), bcryptjs, Nodemailer (for OTPs)

## Architecture
The backend follows a strict **MVC (Model-View-Controller)** architecture, keeping the database schemas, business logic, and API routes cleanly separated for easy scaling and maintenance.

## Local Setup

### Prerequisites
* Node.js installed
* MongoDB connection string (local or Atlas)
* An email account configured with an App Password for sending OTPs

### 1. Backend Installation
Open a terminal and navigate to the backend directory:
```bash
cd Backend
npm install

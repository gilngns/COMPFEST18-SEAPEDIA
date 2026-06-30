<div align="center">

# 🛒 SEAPEDIA

**Multi-Seller E-Commerce Platform — COMPFEST 18 Fullstack Challenge**

A full-featured marketplace with multi-role authentication (Admin, Seller, Buyer, Driver), milestone-based order lifecycle, wallet system, and delivery management.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](#-license)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Setup](#2-frontend-setup)
  - [API Documentation](#3-api-documentation)
- [Demo Accounts](#-demo-accounts)
- [E2E Testing Guide](#-e2e-testing-guide)
- [Business Rules](#-business-rules)
- [Security](#-security)
- [License](#-license)

---

## 📖 Overview

**SEAPEDIA** is a multi-seller e-commerce platform built solo for the **COMPFEST 18 Fullstack Challenge**. It implements all 7 challenge levels — from authentication and store management to complex business logic (tax, vouchers, driver earnings, SLA time simulation) and security hardening.

Key capabilities:

- 🔐 **Multi-role auth** — a single account can hold Buyer, Seller, and Driver roles and switch between them.
- 🏪 **Seller stores & products** — full CRUD with soft delete.
- 🛒 **Single-store checkout** — streamlined cart and order management.
- 💰 **Wallet system** — top-up, payments, refunds, and driver earnings.
- 🚚 **Delivery management** — drivers pick up jobs and earn from delivery fees.
- ⏱️ **Time simulation** — admin can fast-forward the virtual clock to trigger SLA jobs.
- 🛡️ **Security hardening** — RBAC, XSS sanitization, input validation, httpOnly JWT.

---

## 🛠 Tech Stack

| Layer        | Technology                                              |
| ------------ | ------------------------------------------------------- |
| **Frontend** | React, Vite, Tailwind CSS, React Router, Lucide Icons   |
| **Backend**  | Node.js, Express, Prisma ORM                            |
| **Database** | PostgreSQL                                              |
| **Auth**     | JWT (httpOnly cookies), multi-role RBAC                 |
| **Jobs**     | node-cron (SLA / overdue checks)                        |
| **Docs**     | Swagger UI (OpenAPI)                                     |
| **Security** | `xss` sanitization, Prisma parameterized queries        |

---

## 📂 Project Structure

```
COMPFEST18-SEAPEDIA/
├── SEAPEDIA-BE/          # Backend (Express + Prisma + PostgreSQL)
│   ├── prisma/           # Schema & migrations
│   ├── src/              # Use cases, routes, middleware
│   ├── seedAdmin.js      # Seeding script for demo accounts
│   └── .env              # Environment variables (not committed)
│
├── SEAPEDIA-FE/          # Frontend (React + Vite + Tailwind)
│   └── src/              # Components, pages, context, layouts
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- A running **PostgreSQL** database (local install or Docker)

### 1. Backend Setup

```bash
cd SEAPEDIA-BE
npm install
```

Create a `.env` file in `SEAPEDIA-BE/` with:

```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/seapedia?schema=public"
JWT_SECRET="your_super_secret_jwt_key_here"
```

Push the schema and seed demo accounts:

```bash
npx prisma db push
node seedAdmin.js     # creates Admin, Seller, Buyer, Driver test accounts
npm run dev           # starts the backend on http://localhost:5000
```

### 2. Frontend Setup

In a **new terminal**:

```bash
cd SEAPEDIA-FE
npm install
npm run dev
```

The frontend will be available at the URL printed by Vite (typically `http://localhost:5173`).

### 3. API Documentation

The API is fully documented with **Swagger UI**. With the backend running, open:

> **http://localhost:5000/api-docs**

---

## 👤 Demo Accounts

Seeded automatically by `node seedAdmin.js`:

| Role   | Email                 | Password      |
| ------ | --------------------- | ------------- |
| Admin  | `admin@seapedia.com`  | `password123` |
| Buyer  | `joko@gmail.com`      | `password123` |
| Seller | `hendri@gmail.com`    | `123123`      |
| Driver | `budi@gmail.com`      | `12345678`    |

---

## 🧪 E2E Testing Guide

Walk through the full marketplace flow:

1. **Admin** (`admin@seapedia.com`) — view platform statistics and test **"Simulasikan Hari Esok (+1 Hari)"** to advance the virtual clock.
2. **Buyer** (`joko@gmail.com`) — top up the wallet, add items from a single store, apply a voucher, and checkout. Submit an application review after completion.
3. **Seller** (`hendri@gmail.com`) — open the Seller Dashboard, create a product, and accept the buyer's order in the **Pesanan** tab (moves it to *Menunggu Kurir*).
4. **Driver** (`budi@gmail.com`) — switch role to Driver, take the shipment from **Cari Order**, mark it delivered, and check the **Finance** tab for the 100% delivery-fee earning.

---

## 📋 Business Rules

<details>
<summary><b>Level 3 — Checkout & Tax</b></summary>

- **Single-Store Checkout**: A cart can only contain products from one store at a time. Adding a product from another store prompts to replace the cart, with a UI alert banner explaining the rule.
- **PPN 12%**: A 12% Value Added Tax is applied to the product **subtotal** (before delivery fees) and itemized as "PPN (12%)" in the checkout summary.

</details>

<details>
<summary><b>Level 4 — Discounts</b></summary>

- **Discount position**: Discounts apply after subtotal, but PPN is still based on the *original* subtotal. Formula:
  ```
  Total = Subtotal − Discount + PPN + DeliveryFee
  ```
- **Voucher vs Promo**: Mutually exclusive — only one discount code per checkout.

</details>

<details>
<summary><b>Level 5 — Driver Earnings</b></summary>

- **100% of the delivery fee** goes to the driver (e.g. INSTANT fee of Rp 25.000 → driver earns Rp 25.000).
- Earnings are credited to the driver's wallet immediately upon confirming delivery (`PESANAN_SELESAI`).

</details>

<details>
<summary><b>Level 6 — SLA & Time Simulation</b></summary>

- **Auto-Cancel / Refund**: Orders stuck in `MENUNGGU_PENGIRIMAN` for more than 3 days are auto-cancelled and refunded to the buyer's wallet.
- **Auto-Complete**: Orders in `DIKIRIM` for more than 3 days are auto-marked `PESANAN_SELESAI`.
- **Simulation**: Admin's "Simulasikan Hari Esok (+1 Hari)" advances the virtual clock by 24h and triggers the overdue job instantly.

</details>

---

## 🛡️ Security

Implemented in **Level 7 — Security Hardening**:

- **SQL Injection Prevention** — all queries go through Prisma ORM with parameterized queries.
- **XSS Protection** — React auto-escapes on the client; the `xss` library sanitizes inputs server-side (reviews, product descriptions).
- **Input Validation** — backend use-cases validate all fields (email format, ratings 1–5, positive stock/price) and reject invalid input with HTTP 400.
- **Session Security** — authentication via `httpOnly` JWT cookies; logout clears the cookie to invalidate the session instantly.
- **RBAC** — middleware enforces `activeRole`; ownership constraints prevent cross-user modifications (e.g. `if (product.storeId !== store.id) throw 403`).

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">
Built with ☕ for COMPFEST 18 by <a href="https://github.com/gilngns">gilngns</a>
</div>

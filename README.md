# SEAPEDIA

SEAPEDIA is a multi-seller e-commerce platform built for COMPFEST 18.

## 🚀 Setup & Installation (Works on Any Machine)

**Requirements**: Node.js 18+ and a running PostgreSQL database.

### 1. Database Setup
Ensure you have a PostgreSQL database running. You can use Docker or a local installation.
Create a `.env` file in the `SEAPEDIA-BE` directory with the following variables:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/seapedia?schema=public"
JWT_SECRET="your_super_secret_jwt_key_here"
```

### 2. Backend Initialization
```bash
cd SEAPEDIA-BE
npm install
npx prisma db push
```

**Creating Demo Accounts (Admin, Seller, Buyer, Driver):**
Run the seeding scripts to automatically create the necessary test accounts:
```bash
node seedAdmin.js
```

### 3. Frontend Initialization
In a new terminal window, start the frontend:
```bash
cd SEAPEDIA-FE
npm install
npm run dev
```

### 4. API Documentation
The API documentation is fully integrated using Swagger UI.
Start the backend server and navigate to:
**[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

## Business Rules Documentation (Level 3)

### 1. Single-Store Checkout Rule
To ensure streamlined shipping and order management, SEAPEDIA implements a **Single-Store Checkout** rule.
- **Behavior**: A single shopping cart can only contain products from *one specific store* at a time.
- **Conflict Handling**: If a Buyer attempts to add a product from Store B while their cart already contains products from Store A, the backend will reject the action (or ask for confirmation to replace the cart). The UI explicitly notifies the user about this restriction via an alert banner in the Cart page.

### 2. Tax Calculation (PPN 12%)
In accordance with the requirements, a Value Added Tax (PPN) is applied to all purchases.
- **Rate**: The tax is set strictly at **12%**.
- **Tax Base**: The 12% PPN is calculated based on the **Subtotal of the products** in the cart before delivery fees are applied.
- **Visibility**: The tax amount is clearly itemized as "PPN (12%)" in the checkout summary UI before the Buyer confirms the payment.

## Business Rules Documentation (Level 4)

### 1. Discount Calculation Position
- **Position Relative to PPN**: Discounts (Voucher / Promo) are applied **AFTER** the subtotal is calculated, but the PPN 12% remains based on the *original Subtotal* of the products. The final formula is: `Total = Subtotal - Discount + PPN + DeliveryFee`. This ensures the tax base remains consistent regardless of applied discounts.
- **Voucher vs Promo**: The system handles them exclusively. Only one discount code can be used per checkout.

## Business Rules Documentation (Level 5)

### 1. Driver Earnings Rule
To ensure a clear and fair compensation model for the delivery process, the Driver's earnings are calculated directly from the delivery fee paid by the Buyer.
- **Earning Calculation**: The Driver receives **100% of the Delivery Fee**. (e.g., if the Buyer selects the INSTANT delivery method with a fee of Rp 25.000, the Driver's earning for that job is exactly Rp 25.000).
- **Earning Distribution**: The earning is credited to the Driver's digital wallet immediately after they confirm the delivery is completed (`PESANAN_SELESAI`).

## Business Rules Documentation (Level 6)

### 1. Overdue SLA & Time Simulation
In the real world, orders that are ignored by sellers or not confirmed by buyers will eventually timeout.
- **Auto-Cancel / Refund**: If an order stays in `MENUNGGU_PENGIRIMAN` (Waiting for Seller) for more than **3 days**, it becomes overdue. The system automatically cancels it and issues a **Refund** to the Buyer's wallet.
- **Auto-Complete**: If an order stays in `DIKIRIM` (Shipped) for more than **3 days** without the Buyer clicking "Pesanan Diterima", the system automatically marks it as `PESANAN_SELESAI`.
- **Simulation**: Since we cannot wait for 3 days during testing, an Admin can simulate time via the **Admin Dashboard**. Clicking "Simulasikan Hari Esok (+1 Hari)" advances the virtual server clock by 24 hours and triggers the overdue checking job instantly.

## Security Hardening (Level 7)

SEAPEDIA implements robust security measures to protect users and data:
1. **SQL Injection Prevention**: All database queries are handled through **Prisma ORM**. Prisma inherently uses parameterized queries, eliminating the risk of SQL injection across all login, search, and checkout forms.
2. **XSS Protection**: 
   - On the Client: React auto-escapes all rendered text natively.
   - On the Server: The backend utilizes the `xss` library to sanitize user inputs, explicitly focusing on **Public Application Reviews** and **Product Descriptions**. Malicious `<script>` tags are scrubbed before reaching the database.
3. **Input Validation**: Backend use-cases (e.g., `buyer.usecase.js`, `seller.usecase.js`) actively validate all required fields (email format, ratings 1-5, positive stock/price, etc.) and reject invalid inputs with standard HTTP 400 responses.
4. **Session Behavior**: Authentication relies on `httpOnly` JWT cookies. Logging out securely invokes `res.clearCookie("token")`, instantly invalidating the session.
5. **Role-Based Access Control (RBAC)**:
   - The backend checks `req.user.activeRole` via a stringent middleware (`requireRole`). 
   - A multi-role user *cannot* access Seller endpoints if their currently active role is Buyer. They must explicitly switch roles.
   - Cross-user modifications (e.g., Seller A editing Seller B's product, or Buyer A viewing Buyer B's order) are strictly prevented by validating ownership constraints on the server side (e.g., `if (product.storeId !== store.id) throw 403`).

## 🧪 E2E Demo Testing Guide

To fully test the SEAPEDIA flows:
1. **Login as Admin** (`admin@seapedia.com` / `password123`) to view overall platform statistics and test the "Simulasikan Hari Esok" button.
2. **Login as Buyer** (`joko@gmail.com` / `password123`). Top-up the wallet using the dummy top-up button. Add items from a single store to the cart, apply a voucher (if available), and checkout. Submit an application review after the order is completed.
3. **Login as Seller** (`hendri@gmail.com` / `123123`). Navigate to the Seller Dashboard. Create a new product. Check the "Pesanan" tab to accept Joko's order (moving it to "Menunggu Kurir").
4. **Login as Driver** (`budi@gmail.com` / `12345678`). Switch the role to Driver. Open the "Cari Order" tab to take Hendri's shipment. Mark it as delivered. Check the Finance tab to see the 100% earning from the delivery fee.
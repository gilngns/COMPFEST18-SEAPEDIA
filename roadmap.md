# SEAPEDIA — Technical Challenge Breakdown

**Sumber:** Software Engineering Academy COMPFEST 18
**Total Core:** 100 pts · **Bonus:** 25 pts (UI 10 + Deployment 15)

SEAPEDIA adalah platform e-commerce multi-seller yang menghubungkan **Seller, Buyer, Driver, dan Admin**. Client boleh web atau mobile, tapi backend wajib **API-based**. Dibangun bertahap per level — Level N diasumsikan sudah mencakup Level 1 s/d N.

> **Aturan penilaian:** Submission yang klaim Level N hanya dinilai dari Level 1–N. Bonus UI & deployment dinilai terpisah dan tidak bisa menutup kekurangan core level.

---

## Core Business Rules (berlaku lintas level)

- 4 role akun: **Admin, Seller, Buyer, Driver**.
- Untuk akun non-admin, satu username boleh punya >1 role sekaligus.
- User dengan multi-role wajib **memilih active role** setelah login.
- **Otorisasi mengikuti active role**, bukan sekadar daftar role yang dimiliki.
- Guest boleh browse katalog, detail produk, dan review publik — tapi **tidak bisa** checkout / akses dashboard privat.
- Guest atau user login boleh submit **review aplikasi** tanpa perlu transaksi.
- Store name harus **unik**.
- Buyer wajib punya cart, wallet balance, alamat pengiriman, dan checkout flow.
- Checkout menghitung: **subtotal, discount, delivery fee, PPN 12%, final total**.
- Discount mendukung **Voucher** dan **Promo**.
- Metode pengiriman: **Instant, Next Day, Regular**.
- Setiap order menyimpan **status history + timestamp**.
- Seller harus **memproses order** sebelum Driver bisa ambil job.
- Driver bisa **find / take / confirm** job.
- Sistem mendukung **auto refund / auto return** untuk order overdue (berdasar metode kirim).
- Ada cara **simulasi next day** (scheduler / cron / worker / command / manual Admin trigger).
- User-generated content (review, comment) harus aman — input jahat tidak boleh tereksekusi.

### Main Order Lifecycle (wajib visible & konsisten)
`Sedang Dikemas → Menunggu Pengirim → Sedang Dikirim → Pesanan Selesai → Dikembalikan`

### Cart Behavior Rule
**Single-store checkout** — satu cart hanya boleh berisi produk dari **satu store**. Jika buyer menambah produk dari store lain, sistem harus mencegah atau minta clear cart dulu. Wajib dijelaskan di UI, konsisten di backend, dan didokumentasikan di README.

---

## Level 1 — Public Marketplace, Authentication & Reviews (20 pts)

### Public Marketplace Interface (4 pts)
- [ ] Landing / home page
- [ ] Product listing page (akses guest)
- [ ] Product detail page (read-only)
- [ ] Login page & register page
- [ ] Boleh pakai dummy product data jika backend belum terintegrasi

**Rules:** guest hanya browse; aksi privat (checkout, manajemen produk, delivery) tidak ditampilkan ke guest; UI harus terasa sebagai *marketplace*, bukan toko tunggal.

### Basic Authentication & Role Awareness (8 pts)
- [ ] Registrasi, login, logout
- [ ] Password **hashing**
- [ ] Token / JWT / session untuk autentikasi request
- [ ] Data model mendukung Admin, Seller, Buyer, Driver
- [ ] Satu username non-admin boleh punya >1 role
- [ ] Endpoint return daftar role user
- [ ] Pemilihan active role (page/modal jika role >1)
- [ ] Proteksi route & endpoint berdasar **active role**
- [ ] Endpoint profil user yang sedang login
- [ ] Dashboard summary: role yang dimiliki + active role
- [ ] Placeholder balance / financial summary (real balance menyusul)

**Rules:** multi-role user tidak boleh langsung diarahkan ke dashboard sebelum pilih active role; otorisasi berbasis active role; active role jelas terlihat di UI; Admin boleh ditangani terpisah tapi terdokumentasi.

### Public Application Reviews (4 pts)
- [ ] Section review/testimonial di halaman publik
- [ ] Form: **nama reviewer, rating 1–5, komentar**
- [ ] Tampilan list / carousel review
- [ ] Bisa dipakai tanpa checkout/transaksi
- [ ] Storage boleh frontend state / local storage / backend

**Rules:** review tentang aplikasi (bukan produk); guest boleh submit kecuali implementasi mewajibkan login + alasan; komentar dirender sebagai teks biasa, tidak merusak layout (XSS formal dinilai di Level 7).

### Reusable UI Foundations (4 pts)
- [ ] Komponen reusable: Button, Input, Card, Navbar/Top Bar, Footer/Bottom Nav
- [ ] Struktur routing untuk public & private
- [ ] Dashboard shell/placeholder untuk 4 role
- [ ] Navigasi responsif desktop & mobile
- [ ] Beda jelas navigasi guest vs logged-in

---

## Level 2 — Seller Experience (15 pts)

### Seller Store Management (5 pts)
- [ ] Data model store
- [ ] Form create/update store profile
- [ ] Field store name
- [ ] Validasi error jika store name sudah dipakai
- [ ] Endpoint/display block ringkasan store publik

**Rules:** store name unik (DB constraint / backend validation / keduanya); seller hanya kelola store sendiri.

### Product Management for Sellers (6 pts)
- [ ] Product data: name, description, price, **stock**, store owner
- [ ] Endpoint + UI create / update / delete produk
- [ ] Dashboard list produk milik seller

**Rules:** seller hanya buat produk di store sendiri; hanya edit/hapus produk miliknya; stock wajib disimpan (dipakai checkout nanti).

### Connect Products to Public Catalog (4 pts)
- [ ] Endpoint publik list produk
- [ ] Endpoint publik detail produk
- [ ] Info store di listing/detail
- [ ] Store detail page / info block

**Rules:** guest boleh lihat katalog & detail tanpa login; guest tidak bisa create/update/delete/checkout.

---

## Level 3 — Buyer Wallet, Cart & Checkout (20 pts)

### Buyer Wallet & Address (5 pts)
- [ ] Resource wallet/balance
- [ ] Dummy top-up flow
- [ ] Riwayat transaksi wallet
- [ ] Manajemen alamat pengiriman
- [ ] Tampilkan balance + riwayat top-up di dashboard

**Rules:** hanya active Buyer yang akses fitur wallet/address; wallet harus bisa dipakai checkout.

### Cart Management (5 pts)
- [ ] Add / update qty / remove produk
- [ ] Endpoint + UI cart summary
- [ ] **Single-store checkout** enforcement

**Rules:** cart tolak produk dari store berbeda atau tangani konflik dengan jelas; perilaku single-store terlihat di UI & terdokumentasi di README.

### Checkout & Basic Orders (10 pts)
- [ ] Endpoint checkout / create order
- [ ] Delivery methods: Instant, Next Day, Regular
- [ ] Hitung subtotal, delivery fee, **PPN 12%**, final total
- [ ] Checkout summary sebelum konfirmasi
- [ ] Order mengikuti single-store behavior
- [ ] Reduksi stock aman setelah checkout
- [ ] Order history & detail untuk Buyer
- [ ] Incoming order list untuk Seller
- [ ] Status history + timestamp

**Rules:** tolak checkout jika balance kurang; delivery fee beda per metode; PPN tampil 12% (jika beda tax base, jelaskan di README); status awal **Sedang Dikemas**; stock tidak boleh negatif.

---

## Level 4 — Discounts & Seller Order Processing (15 pts)

### Voucher & Promo Discounts (6 pts)
- [ ] Resource Voucher & Promo
- [ ] Admin endpoint generate voucher/promo
- [ ] Endpoint list & detail
- [ ] Voucher: **expiry date + remaining usage**
- [ ] Promo: **expiry date**
- [ ] Checkout terima discount code + validasi
- [ ] Efek discount di checkout summary
- [ ] Subtotal, discount, delivery fee, PPN 12%, final total tetap visible

**Rules:** voucher/promo expired tidak bisa dipakai; voucher tanpa sisa usage tidak bisa dipakai; aturan kombinasi voucher+promo jelas & konsisten; voucher vs promo dibedakan jelas; posisi discount relatif terhadap PPN konsisten & terdokumentasi.

> Di level ini voucher/promo cukup via seed data / API doc / minimal admin setup. UI admin lengkap baru wajib di Level 6.

### Seller Process Orders (4 pts)
- [ ] Aksi seller proses incoming order
- [ ] Status **Sedang Dikemas → Menunggu Pengirim**
- [ ] Simpan perubahan status + timestamp
- [ ] Timeline/status tracker di halaman Buyer & Seller

**Rules:** hanya seller pemilik order yang boleh proses; order tidak tersedia ke Driver sebelum diproses; status utama tetap visible.

### Buyer & Seller Reports (5 pts)
- [ ] Buyer spending/expense summary
- [ ] Seller income/revenue summary
- [ ] Buyer: order history, detail, status history + timestamp
- [ ] Seller: incoming, processed, income summary
- [ ] Discount, delivery fee, PPN 12%, final total visible di detail

---

## Level 5 — Delivery & Driver Workflow (10 pts)

### Delivery Jobs for Drivers (4 pts)
- [ ] Resource delivery/job
- [ ] Endpoint + UI find available jobs
- [ ] Endpoint + UI detail job
- [ ] Hanya tampilkan job siap diambil

**Rules:** driver hanya ambil job status **Menunggu Pengirim**; tidak lihat/ambil order Sedang Dikemas; job terhubung ke order spesifik.

### Take Job & Completion (4 pts)
- [ ] Aksi take job
- [ ] Status → **Sedang Dikirim** saat job diambil
- [ ] Aksi confirm completed
- [ ] Status → **Pesanan Selesai** saat selesai
- [ ] Setiap perubahan status + timestamp
- [ ] Buyer & Seller bisa track status

**Rules:** satu order satu active driver; driver tidak bisa ambil job yang sudah diambil; lifecycle status valid; tracking jelas.

### Driver Earnings & History (2 pts)
- [ ] Dashboard driver: active job, history, earnings
- [ ] Aturan perhitungan earning (dari delivery fee atau rule lain, terdokumentasi)
- [ ] Tampilkan earning per job selesai

---

## Level 6 — Admin Monitoring & Overdue Handling (10 pts)

### Admin Monitoring Dashboard (3 pts)
Monitoring data untuk: **users, stores, products, orders, vouchers/promos, delivery jobs, overdue orders**.

**Rules:** halaman admin hanya untuk role Admin; data cukup berguna untuk demo keseluruhan sistem.

### Voucher & Promo Management UI (2 pts)
- [ ] UI generate voucher & promo
- [ ] UI list & detail voucher
- [ ] UI list & detail promo
- [ ] Tampilkan expiry date & info usage

### Overdue Auto Return / Refund (5 pts)
- [ ] SLA rules untuk Instant, Next Day, Regular
- [ ] Auto refund / auto return untuk order overdue
- [ ] Order overdue → status final minimal **Dikembalikan**
- [ ] Simpan perubahan status + timestamp
- [ ] Hasil overdue/refund/return tampil di UI
- [ ] Cara simulasi next day / majukan waktu

**Rules:** overdue mempertimbangkan metode kirim; hasil verifiable lewat UI/API/status history; tidak boleh ubah order diam-diam tanpa jejak; hasil akhir tercermin jelas di status.

---

## Level 7 — Security Hardening & Finalization (10 pts)

### Secure Inputs, Queries & Comments (4 pts)
- [ ] Cegah **SQL Injection** (parameterized query / ORM-safe)
- [ ] Cegah **XSS** (escape/sanitize sebelum render, termasuk komentar review)
- [ ] Validasi field wajib: email, phone, rating, quantity, price, stock, discount
- [ ] Tolak input invalid/berbahaya + error jelas
- [ ] Komentar review tidak bisa eksekusi script / merusak layout

**Test:** masukkan `<script>` ke komentar (harus aman/ditolak); masukkan payload SQL ke login/search/review/checkout (tidak boleh memengaruhi DB).

### Harden Session & RBAC (3 pts)
- [ ] Logout invalidate/clear session/token
- [ ] Protected endpoint tidak bisa diakses lewat manipulasi route frontend
- [ ] Active role diverifikasi **server-side**
- [ ] Cegah akses/modifikasi resource milik user lain
- [ ] Token/session expiration wajar + terdokumentasi

**Rules:** backend tidak percaya role hanya karena tampil di UI; multi-role user hanya boleh aksi sesuai active role; endpoint admin tidak bisa diakses non-admin.

### Final Documentation & Demo Data (3 pts)
- [ ] API docs (Swagger/OpenAPI / Postman)
- [ ] Seed data / demo account untuk 4 role
- [ ] Dokumentasi: single-store checkout, aturan kombinasi discount & PPN 12%, aturan earning driver, SLA overdue & simulasi waktu, langkah keamanan
- [ ] Testing guide end-to-end

---

## Final Demo Checklist

**Guest, Review & Auth**
- [ ] Guest browse katalog & detail
- [ ] Guest/user submit review (rating + komentar) tanpa transaksi
- [ ] Review tampil aman
- [ ] Register & login
- [ ] Multi-role pilih active role
- [ ] Dashboard privat terproteksi by active role

**Seller**
- [ ] Buat store dengan nama unik
- [ ] CRUD produk
- [ ] Produk muncul di katalog publik
- [ ] Proses order Sedang Dikemas → Menunggu Pengirim

**Buyer**
- [ ] Top-up dummy
- [ ] Kelola alamat & cart
- [ ] Checkout dengan metode kirim + optional voucher/promo
- [ ] Summary tampil subtotal, discount, delivery fee, PPN 12%, total
- [ ] Lihat history, detail, status timeline

**Driver**
- [ ] Find / take / confirm job
- [ ] Lihat history & earnings

**Admin, Overdue & Security**
- [ ] Monitor users, stores, products, orders, discounts, deliveries, overdue
- [ ] Generate & lihat voucher/promo
- [ ] Simulasi next day
- [ ] Min. 1 skenario auto return/refund
- [ ] SQL Injection & XSS ditangani aman
- [ ] RBAC bekerja dari backend, bukan hanya UI

---

## Delivery Requirements

1. **Works on any machine** — bisa jalan di mesin mana pun.
2. **Repository** — push ke GitHub/GitLab, visibility **public**.
3. **README** — cara setup & run, env variables, cara buat admin account.
4. **API Documentation** — Swagger/OpenAPI/Postman.
5. **Security Notes** — SQLi, XSS, validasi input, session, RBAC.
6. **Git Commit History** — commit bertahap, jangan squash jadi satu.
7. **Deployment Link (optional)** — URL publik + info environment di README.

## Assessment Components
Kelengkapan kriteria per level · kebenaran business rules & role behavior · clean code & struktur · desain API & separation of concerns · responsif lintas layar · keamanan auth/input/akses · README & API docs jelas · kualitas demo end-to-end.

## Bonus (25 pts)
- UI kreatif & intuitif — **10 pts**
- Deployment yang bisa diakses & diuji evaluator — **15 pts**

---

## Catatan untuk Stack-mu (SEAPEDIA-BE / SEAPEDIA-FE)
- BE: Express + Prisma v6 + PostgreSQL · FE: React · target deploy: VPS Hostinger.
- Progress saat ini: schema 17-model selesai, Level 1 auth (register/login/select-role/JWT multi-role) selesai, Level 2 seller store & product CRUD selesai.
- Fokus berikutnya sesuai breakdown: lanjut ke Level 3 (wallet → cart → checkout).
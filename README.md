# 🎾 Pádel Ciaga — Sales, Orders & Shipping System

Node + `pg` backend (with transactions) and a vanilla frontend to manage products, customers, and purchase orders.

## 📦 Requirements

- Node.js 18+
- PostgreSQL 14+
- A DB client (pgAdmin or `psql`)

## 🗄️ 1. Database

```bash
createdb -U postgres -h localhost padel_ventas
psql -U postgres -h localhost -d padel_ventas -f database/01-create-tables.sql
psql -U postgres -h localhost -d padel_ventas -f database/02-seed.sql
```

Or run `01-create-tables.sql` and `02-seed.sql` directly in pgAdmin's Query Tool.

🔄 To reset everything: `database/03-reset.sql`

## ⚙️ 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=padel_ventas
PORT=3000
```

Start the server:

```bash
npm run dev
```

✅ You should see `Server running on port 3000` and `connected`.

## 🎨 3. Frontend

Open `frontend/index.html` with **Live Server** (VS Code extension) — right click → *Open with Live Server*.

⚠️ The backend must be running before you open the frontend, or the fetch calls will fail.

## 🚀 4. Usage

| Page | What it does |
|---|---|
| 🏠 Menu | Links to the 3 sections |
| 🛍️ Products | Lists the full catalog |
| 📋 Orders | Look up a customer's orders by RUT |
| ➕ Create order | RUT → address → products and quantities → POST `/orden` |

## 🧪 Quick test

Sample RUT already loaded: `12345678-5`

## 📁 Structure

```
├── database/     # SQL scripts (create, seed, reset)
├── backend/      # Node + Express + pg API
└── frontend/     # HTML + CSS + vanilla JS
```

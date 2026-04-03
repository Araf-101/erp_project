# ERP Project

Full-stack ERP starter: **Next.js** frontend, **Laravel 13** REST API, **PostgreSQL**, and Docker Compose.

## Stack

- Frontend: Next.js (App Router), TypeScript, Tailwind CSS
- Backend: PHP 8.4 (Dockerfile) / PHP 8.3+ locally, Laravel 13, Laravel Sanctum (Bearer API tokens)
- Database: PostgreSQL 16
- Containers: Docker Compose, Nginx + PHP-FPM + Supervisor (backend), Node standalone (frontend)

## Repository structure

```text
erp_project/
├── frontend/          # Next.js client
├── backend/           # Laravel API
├── docker-compose.yml
└── README.md
```

## Services and ports (Docker Compose)

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000 (routes under `/api/*`)
- Adminer: http://localhost:8080 (use system **PostgreSQL**, server `db`, DB `erp_db`, user `laravel`, password `secret`)
- PostgreSQL: `localhost:5433` (maps to port `5432` inside Docker; avoids clashing with a local Postgres install)

## Quick start (Docker)

```bash
docker compose up --build
```

On first run the backend container runs `php artisan migrate --force`. Optional demo admin user:

```bash
docker compose exec backend php artisan db:seed --force
```

**Seeded login:** `admin@erp.local` / `password` (change in production).

You can also **register** via `POST /api/register` or sign up from the Next.js app if you add a register page.

## API (summary)

Public:

- `POST /api/register` — `{ name, email, password }` → `{ token, user }`
- `POST /api/login` — `{ email, password }` → `{ token, user }`

Authenticated (`Authorization: Bearer <token>`):

- `GET /api/user`
- Customers / products: `GET|POST|GET{id}|PUT|DELETE /api/customers`, `/api/products`
- Orders: `GET|POST /api/orders`, `GET /api/orders/{id}` (POST body: `customer_id`, `items: [{ product_id, quantity }]`, optional `status`)
- Transactions: `GET|POST /api/transactions`

## Local development (without Docker)

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Ensure PostgreSQL matches `.env`, then:

```bash
php artisan migrate
php artisan db:seed   # optional admin user
php artisan serve
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# set NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
npm run dev
```

Default dev server: http://localhost:3000

## CORS

`backend/config/cors.php` allows `http://localhost:3000` and `http://127.0.0.1:3000` for the SPA.

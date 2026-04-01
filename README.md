# ERP Project

This repository is a full-stack starter for an ERP application. It currently combines a React frontend, a Laravel backend, and a MySQL database, with Docker support for running the full stack together.

The application is still at a scaffold stage:

- The frontend is a Vite + React starter UI in `frontend/`
- The backend is a Laravel 13 application in `backend/`
- Docker Compose wires the frontend, backend, MySQL, and Adminer together

## Stack

- Frontend: React 19, Vite 8, ESLint 9
- Backend: PHP 8.3, Laravel 13
- Database: MySQL 8
- Containers: Docker, Docker Compose, Nginx, Supervisor

## Repository Structure

```text
erp_project/
├── frontend/          # React client
├── backend/           # Laravel API / server app
├── docker-compose.yml # Full stack container setup
└── README.md
```

## Services and Ports

When started with Docker Compose, the following services are exposed:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Adminer: `http://localhost:8080`
- MySQL: `localhost:3307`

Default database credentials from `docker-compose.yml`:

- Database: `erp_db`
- Username: `laravel`
- Password: `secret`
- Root password: `root`

## Prerequisites

Choose one of the following workflows.

### Docker workflow

- Docker
- Docker Compose

### Local development workflow

- Node.js 20+
- npm
- PHP 8.3+
- Composer
- MySQL 8

## Quick Start With Docker

Start the full stack:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up --build -d
```

Stop the services:

```bash
docker compose down
```

This starts:

- `frontend`: production React build served by Nginx
- `backend`: Laravel served through Nginx + PHP-FPM
- `db`: MySQL 8
- `adminer`: lightweight database UI

## Local Development

### 1. Backend setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Update `.env` with your local database settings, then run:

```bash
php artisan migrate
php artisan serve
```

The Laravel app will be available at `http://127.0.0.1:8000`.

### 2. Frontend setup

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server will be available at `http://localhost:5173`.

## Useful Commands

### Frontend

```bash
cd frontend
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend

```bash
cd backend
composer install
php artisan serve
php artisan migrate
php artisan test
```

Laravel also includes a convenience script for local development:

```bash
cd backend
composer run dev
```

## Current State

This repository is not yet a complete ERP system. At the moment it contains:

- A starter React UI
- A starter Laravel application with default routes
- Containerized infrastructure for frontend, backend, database, and DB admin access

If you plan to grow this into a production ERP, the next steps are typically:

- Define business modules and domain models
- Build API endpoints in Laravel
- Connect the React app to backend APIs
- Add authentication, authorization, and role management
- Add test coverage and deployment configuration

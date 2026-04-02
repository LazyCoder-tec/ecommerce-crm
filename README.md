# EduCommerce — E-Commerce + CRM Platform

A full-stack e-commerce platform for online courses with a built-in CRM, built with:

- **Backend:** Spring Boot 3.2 · Spring Security · JWT · Spring Data JPA · Hibernate
- **Frontend:** React 18 · Vite · React Router · Stripe Elements · Recharts
- **Database:** PostgreSQL 15
- **Payments:** Stripe (test mode)

---

## Project Structure

```
ecommerce-crm/
├── backend/                  # Spring Boot application
│   ├── src/main/java/com/ecommerce/
│   │   ├── config/           # Security, DataInitializer
│   │   ├── controller/       # REST endpoints
│   │   ├── service/          # Business logic
│   │   ├── repository/       # JPA repositories
│   │   ├── entity/           # DB entities
│   │   ├── dto/              # Data transfer objects
│   │   ├── security/         # JWT filter & service
│   │   └── exception/        # Custom exceptions & handler
│   └── src/main/resources/
│       └── application.yml   # Configuration
├── frontend/                 # React + Vite app
│   └── src/
│       ├── pages/            # All page components
│       ├── components/       # Reusable UI components
│       ├── services/         # Axios API calls
│       ├── context/          # AuthContext
│       └── App.jsx           # Routes
└── docker-compose.yml        # PostgreSQL via Docker
```

---

## Quick Start

### 1. Prerequisites

| Tool | Version |
|------|---------|
| Java | 17+ |
| Node.js | 18+ |
| Maven | 3.8+ |
| Docker | Any recent |

### 2. Start PostgreSQL

```bash
docker-compose up -d
```

### 3. Configure Backend

Edit `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/ecommerce_crm
    username: postgres
    password: yourpassword   # change this

stripe:
  secret-key: sk_test_YOUR_KEY   # from stripe.com dashboard
```

### 4. Run Backend

```bash
cd backend
mvn spring-boot:run
# Starts on http://localhost:8080
# Auto-creates DB tables and seeds admin + 6 sample courses
```

### 5. Configure Frontend

Edit `frontend/.env`:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY   # from stripe.com
```

### 6. Run Frontend

```bash
cd frontend
npm install
npm run dev
# Starts on http://localhost:5173
```

---

## Default Login Credentials

| Role  | Email           | Password  |
|-------|-----------------|-----------|
| Admin | admin@app.com   | admin123  |

Register a new user account from the Register page.

---

## Features

### User Module
- Register & login with JWT authentication
- Browse course catalog with search and level filter
- Purchase courses via Stripe payment gateway
- View purchased courses in My Courses
- Submit feedback with star rating
- Profile page with purchase history

### Admin Module
- Dashboard with live stats and sales charts (7-day bar + line chart)
- Course Management — add, edit, delete with confirmation dialogs
- Customer Management — view all users, ban/unban, see purchase counts
- Sales Report — full transaction table, revenue breakdown, charts
- Feedback — view all feedback, mark as read/unread, star ratings
- CRM Follow-Ups — add notes per customer, view note history

### Payment Flow (Stripe)
1. User clicks "Buy Now"
2. Backend creates a Stripe `PaymentIntent`
3. React shows Stripe Elements card form
4. User enters card → Stripe processes payment
5. On success → backend marks order as `SUCCESS`
6. Course appears in "My Courses"

**Test card:** `4242 4242 4242 4242` · Any future date · Any CVC

---

## API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/courses | Public |
| POST | /api/courses | Admin |
| PUT | /api/courses/{id} | Admin |
| DELETE | /api/courses/{id} | Admin |
| GET | /api/orders/my-courses/{userId} | User |
| POST | /api/payment/create-intent | User |
| POST | /api/payment/confirm | User |
| POST | /api/feedback/{userId} | User |
| GET | /api/admin/stats | Admin |
| GET | /api/admin/sales/daily | Admin |
| GET | /api/admin/users | Admin |
| PATCH | /api/admin/users/{id}/ban | Admin |
| GET | /api/feedback/all | Admin |
| PATCH | /api/feedback/{id}/read | Admin |
| POST | /api/admin/followups | Admin |
| GET | /api/admin/followups/{userId} | Admin |

---

## Tech Stack Details

- **Spring Security** — stateless JWT auth, role-based access (`ROLE_USER` / `ROLE_ADMIN`)
- **Hibernate** — `ddl-auto: update` auto-creates all tables from entities on startup
- **Stripe** — PaymentIntent API, test mode, client-side Elements for secure card handling
- **Recharts** — Bar and Line charts for sales analytics
- **React Router v6** — protected routes for User and Admin
- **react-hot-toast** — popup notifications for success/error actions

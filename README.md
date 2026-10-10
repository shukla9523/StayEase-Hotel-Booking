# StayEase — Modern Hotel Booking Web Application

StayEase is a full-stack, production-grade hotel booking platform inspired by the design and user experience of Booking.com, Airbnb, and MakeMyTrip. It features custom branding, deep navy & teal aesthetics, real-time date availability, server-side dynamic pricing calculations, atomic inventory protection, secure authentication with HTTP-only cookies, an interactive demo payment gateway + Stripe test mode, and a comprehensive admin management suite.

---

## 🌟 Key Features

### For Travelers
- **Intuitive Discovery**: Search stays by destination city, check-in & check-out dates, and guest count.
- **Dynamic Filtering & Sorting**: Filter by price range, star rating, guest review score, property type, and amenities (WiFi, Pool, Spa, Ocean View, Breakfast, etc.). Sort by Recommended, Price (Low to High / High to Low), or Guest Rating.
- **Rich Hotel & Room Details**: Multi-image galleries with high-resolution lightbox viewer, full list of amenities, policies, geo-location badges, and distinct room categories with bed types and guest capacities.
- **Live Inventory & Availability Engine**: Date-conflict detection preventing overlapping bookings.
- **Server-Side Financial Accuracy**: Base rate, stay discount, 12% GST tax, and platform service fees calculated strictly on the backend.
- **Frictionless Checkout**: Real-time guest capacity verification and interactive payment sandbox with instant server verification (supports both Stripe test mode and zero-config Demo Gateway).
- **Booking Management**: View past and upcoming trips, unique booking references, status badges, and policy-compliant 1-click cancellations with instant room inventory release.
- **Verified Guest Reviews**: Write reviews with star ratings and comments for completed stays.

### For Administrators (`/admin`)
- **Executive KPI Dashboard**: Live metrics for Total Revenue, Total Bookings, Confirmed Trips, Active Hotels, and Registered Users.
- **Hotel Catalog CRUD**: Add, edit, toggle status, and manage hotel descriptions, images, coordinates, and star ratings.
- **Room Inventory Control**: Configure room categories, bed types, guest capacities, total room inventory, amenities, and nightly rates.
- **Booking Governance**: Filter all system reservations by status (`pending`, `confirmed`, `cancelled`, `completed`) and update operational statuses.
- **User & Role Management**: Inspect user profiles, registration dates, and elevate/revoke administrative privileges.
- **Review Moderation**: Inspect and remove inappropriate reviews with automatic recalculation of hotel average scores and review counts.
- **Analytics Visualization**: Revenue and reservation trend charts.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, React Router DOM v7, Lucide React, Axios, React Context API |
| **Backend** | Node.js, Express.js, RESTful API architecture, Cookie Parser, CORS, Helmet, Express Rate Limit |
| **Database** | MongoDB with Mongoose ODM (Supports local MongoDB, MongoDB Atlas, or built-in embedded Mongo) |
| **Security** | JWT authentication (HTTP-only cookies + Bearer token fallback), bcrypt password hashing, input sanitization, centralized error handling |
| **Payments** | Stripe Test Mode SDK + Built-in Interactive Demo Payment Gateway for zero-config local testing |

---

## 📋 Prerequisites

- **Node.js**: v18.0.0 or later (Node 20+ recommended)
- **npm**: v9.0.0 or later
- **MongoDB**: Optional! StayEase automatically launches an embedded in-memory MongoDB instance if no local or Atlas connection is provided.

---

## 🚀 Quick Start Guide

### 1. Clone & Setup Workspace
```bash
git clone <repository-url>
cd "Hotel Booking App"
```

### 2. Configure Backend
```bash
cd server
cp .env.example .env
npm install
```

*(Optional)* Review `server/.env`. By default, leaving `MONGO_URI` empty triggers the zero-config embedded database with auto-seeding.

### 3. Configure Frontend
```bash
cd ../client
cp .env.example .env
npm install
```

### 4. Run the Application

In terminal 1 (Backend API):
```bash
cd server
npm run dev
# Starts backend on http://localhost:5000
```

In terminal 2 (Frontend Client):
```bash
cd client
npm run dev
# Starts client on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Accounts

The database is pre-seeded with 12 Indian hotels across Jaipur, Delhi, Mumbai, Goa, Bengaluru, Udaipur, and Manali, alongside sample reviews and two pre-configured accounts:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin@stayease.com` | `Admin@123` | Full Admin Dashboard (`/admin`) + Customer Features |
| **Demo Traveler** | `user@stayease.com` | `User@123` | Search, Booking, Profile, My Bookings |

> You can also register a new account anytime via `/register`.

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `CLIENT_URL` | Allowed CORS origin | `http://localhost:5173` |
| `MONGO_URI` | MongoDB connection URI | *Blank for embedded Mongo*, or `mongodb://localhost:27017/stayease` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `stayease_super_secure_jwt_secret_key_2026_dev_env` |
| `JWT_EXPIRES_IN` | Token expiration period | `7d` |
| `STRIPE_SECRET_KEY` | *(Optional)* Stripe secret key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | *(Optional)* Stripe webhook secret | `whsec_...` |
| `CLOUDINARY_CLOUD_NAME` | *(Optional)* Cloudinary cloud name | `stayease` |

### Frontend (`client/.env`)
| Variable | Description | Default / Example |
|---|---|---|
| `VITE_API_BASE_URL` | Backend REST API endpoint | `http://localhost:5000/api` |
| `VITE_STRIPE_PUBLIC_KEY` | *(Optional)* Stripe publishable key | `pk_test_...` |

---

## 💳 Payment Gateway & Sandbox

StayEase includes a dual-mode payment architecture:
1. **Interactive Demo Payment Gateway (Zero-Config)**:
   - When Stripe keys are not supplied, the checkout page renders an interactive demo payment sandbox.
   - Users can simulate **Success** (instant confirmation & verified booking reference generation) or **Declined** (rejection handling with error feedback).
   - Payments are verified strictly on the server via `POST /api/payments/demo-confirm`.
2. **Stripe Test Mode**:
   - When `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLIC_KEY` are provided, the checkout flow can launch Stripe Checkout Sessions with webhook verification at `POST /api/payments/webhook`.

---

## 🗄️ Database Seeding

To manually re-seed the database at any time:
```bash
cd server
npm run seed
```
This script resets the collections and inserts:
- 12 luxury, heritage, and boutique hotels across India.
- 15 diverse room categories (Deluxe, Royal Suite, Beachfront Cottage, Mountain View Chalet, etc.).
- Realistic room inventories, high-definition photo galleries, and amenities.
- Initial admin and guest accounts.
- Initial sample bookings and verified guest reviews.

---

## 📡 API Reference

### Health Check
- `GET /api/health` — System status, uptime, and database connection state.

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Create a new customer account.
- `POST /api/auth/login` — Login user; sets HTTP-only JWT cookie & returns token.
- `POST /api/auth/logout` — Clear session cookies.
- `GET /api/auth/me` — Retrieve active authenticated user profile.
- `PATCH /api/auth/profile` — Update name, phone, preferences.
- `PATCH /api/auth/change-password` — Change password after verifying current credentials.

### Hotels & Rooms (`/api/hotels`)
- `GET /api/hotels` — Search hotels by city, dates, price, star rating, amenities, sorting.
- `GET /api/hotels/:id` — Full hotel profile with active room categories.
- `GET /api/hotels/:id/availability` — Check room availability for specific dates.
- `GET /api/hotels/:id/reviews` — Retrieve verified guest reviews.

### Bookings (`/api/bookings`)
- `POST /api/bookings` — Create a booking with server-side price calculation and atomic room availability check.
- `GET /api/bookings/my` — Fetch current user's booking history.
- `GET /api/bookings/:id` — Inspect booking details (owner or admin only).
- `PATCH /api/bookings/:id/cancel` — Cancel booking according to policy and restore room inventory.

### Payments (`/api/payments`)
- `POST /api/payments/demo-confirm` — Server-side verification for the interactive Demo Sandbox.
- `POST /api/payments/create-checkout-session` — Create Stripe checkout session.
- `POST /api/payments/webhook` — Stripe webhook listener for asynchronous confirmation.

### Reviews (`/api/reviews`)
- `POST /api/reviews` — Submit a review for a completed stay.
- `GET /api/reviews/hotel/:hotelId` — Public reviews for a hotel.

### Admin Operations (`/api/admin`) *(Requires admin role)*
- `GET /api/admin/dashboard` — KPI cards and summary statistics.
- `GET /api/admin/analytics` — Revenue and booking timeseries trends.
- `GET/POST /api/admin/hotels` — List or create hotels.
- `GET/PUT/DELETE /api/admin/hotels/:id` — Inspect, update, or remove hotel.
- `GET/POST /api/admin/rooms` — List or create rooms.
- `GET/PUT/DELETE /api/admin/rooms/:id` — Inspect, update, or remove room.
- `GET /api/admin/bookings` — Filter all system bookings.
- `PATCH /api/admin/bookings/:id/status` — Update booking operational status.
- `GET /api/admin/users` — List all registered users.
- `PATCH /api/admin/users/:id/role` — Update user permissions (`user` <-> `admin`).
- `GET /api/admin/reviews` — Moderate reviews.
- `DELETE /api/admin/reviews/:id` — Delete review and recalculate hotel average score.

---

## 🧪 Automated Testing

StayEase features comprehensive automated backend test suites covering authentication, price calculation, double-booking prevention, cancellation policies, and role-based permissions:

```bash
cd server
npm test
```
All 15 test suites run natively via Node's test runner without external runners needed.

---

## 🔧 Production Deployment Considerations

1. **Database**: Provide a persistent MongoDB Atlas cluster URI in `MONGO_URI`.
2. **Reverse Proxy & SSL**: Deploy backend behind Nginx or AWS ALB with HTTPS to ensure cookies use `SameSite: 'None'; Secure`.
3. **Environment Secrets**: Generate a cryptographically random string for `JWT_SECRET` (`openssl rand -base64 32`).
4. **CORS**: Set `CLIENT_URL` to your production frontend domain (e.g. `https://stayease.com`).
5. **Frontend Build**: Run `npm run build` in `/client` to generate optimized static assets in `/client/dist` and serve via Cloudflare Pages, Vercel, or AWS S3 + CloudFront.

---

## 📄 License
MIT License. Built with ❤️ for travelers and hoteliers.

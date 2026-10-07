# FOODONWHEELS 🚚🍔🍛
## Real-Time Food Discovery, Mobile Vendor Tracking & Local Restaurant Marketplace

FoodOnWheels is a modern full-stack web application connecting customers with BOTH mobile food vendors (food trucks, coffee vans, pizza trucks, ice cream trucks, tea/fruit carts) and stationary local restaurants.

---

## 🌟 Key Product Differentiators
- **Live GPS Vendor Tracking**: Track moving food vendors in real time on a Leaflet dark-styled map with live ETA, route schedules, and crowd meters.
- **3D Vehicle & Product Stage**: Three.js & React Three Fiber canvas featuring 360° controls, door animations, lighting, headlights, and low-poly 3D models for 8 vehicle types.
- **WebSockets Engine**: Socket.IO integration powering real-time inventory updates ("Low Stock", "Sold Out"), queue depth, crowd meter, and Uber-style order progress tracking.
- **All 4 Portals & User Roles**:
  1. **Customer**: Interactive map, 3D configurator, digital menus, daily food reels, social community, table reservations, group orders, food challenges, leaderboard, and Foodie Passport.
  2. **Mobile Vendor**: Seller workspace with live GPS location broadcaster, route scheduler, inventory manager, queue manager, reels uploader, and revenue analytics.
  3. **Restaurant**: Kitchen Display System (KDS), Table Management matrix (Available, Occupied, Reserved, Cleaning), table reservation manager, and revenue analytics.
  4. **Admin**: Platform Control Center with live map monitor, KYC & FSSAI business verification desk, content moderation, and platform revenue analytics.
- **Demo Mode**: 1-click account role switcher on the navigation bar allowing instant seamless testing across Customer, Vendor, Restaurant, and Admin views.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Glassmorphic UI
- **Animations**: Framer Motion
- **3D Engine**: Three.js + `@react-three/fiber` + `@react-three/drei`
- **Maps**: Leaflet + React-Leaflet + CartoDB Dark Matter Tiles
- **Real-Time Client**: Socket.IO Client + Axios

### Backend
- **Server**: Node.js + Express.js + TypeScript
- **Real-Time WebSockets**: Socket.IO Server
- **Database**: MongoDB + Mongoose (with automated in-memory MongoDB fallback engine for 100% reliable out-of-the-box operation)
- **Security & Auth**: JWT + bcryptjs + Role-Based Access Control (RBAC)

---

## 🚀 Quick Start Instructions

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
*The backend server will start on `http://localhost:5000` and automatically seed initial data if empty.*

### 2. Start Frontend Server
```bash
cd frontend
npm run dev
```
*The Next.js frontend will run on `http://localhost:3000`.*

---

## 🔑 Demo Role Credentials

Use the top navigation bar's **Role Switcher** pills or login with:

| Role | Email | Password | Description |
|---|---|---|---|
| **Customer** | `customer@foodonwheels.com` | `password123` | Rahul Sharma (Explores map, 3D, orders, passport) |
| **Mobile Vendor** | `vendor@foodonwheels.com` | `password123` | Ramesh Kumar (Ramesh Burger Truck Seller App) |
| **Restaurant** | `restaurant@foodonwheels.com` | `password123` | Priya Nambiar (Spice Garden KDS & Tables) |
| **Admin** | `admin@foodonwheels.com` | `password123` | Platform SuperAdmin (Verification & Analytics) |

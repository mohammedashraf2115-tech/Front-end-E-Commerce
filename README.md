# ✨ L'ATELIER — Luxury E-Commerce Frontend

> A sophisticated, high-end, and editorial boutique e-commerce application inspired by luxury fashion and perfume design concepts. Built with Angular Standalone Components, Zoneless Change Detection, and custom luxury styling.

---

## 🎨 Visual Identity & UI/UX Philosophy

Inspired by minimalist luxury concepts (such as editorial perfume ateliers and artisanal leather maisons):
* **Editorial Typography:** Classic serif headings using **Cormorant Garamond** paired with ultra-clean, modern **Plus Jakarta Sans** for interface controls and numeric displays.
* **Warm Neutral Palette:** Soothing alabaster (`#FAF9F5`), deep noir (`#121212`), champagne gold accents (`#B89758`), and delicate hairline borders.
* **Micro-interactions:** Interactive card steppers, image zoom transitions, and glassmorphic navigation headers.

---

## 🌟 Key Features

* **Interactive Product Card Stepper:**
  * Increment/decrement items directly from the catalog grid without navigating away.
  * Real-time stock enforcement: `+` button automatically disables when inventory is reached with a clean warning indicator.
  * Status badges: `Sold Out` (charcoal pill) and `Only X Left` (champagne gold pill).
* **Comprehensive Shopping Bag & Guest Cart:**
  * Fully functional for guests in `localStorage` and synchronized with the backend upon authentication.
  * Automatic price updates alert and instant total computation.
* **Frictionless Checkout Flow:**
  * Address selector cards with inline new address creation.
  * Tailored for **Cash on Delivery (COD)** with doorstep inspection reassurance.
* **Client Sanctuary (User Profile):**
  * Profile credential updates, multi-address management, and order history archive with live fulfillment statuses.
* **Maison Admin Portal:**
  * Protected via `AdminGuard`.
  * Real-time business metrics (Revenue, Pending Orders, Low Stock Alerts ≤ 3, Out of Stock counts).
  * Order fulfillment status updater.

---

## 🛠️ Tech Stack

* **Framework:** Angular 22 (Standalone Architecture)
* **Reactivity:** Zoneless Change Detection (`provideBrowserGlobalErrorListeners` + `ChangeDetectorRef` / RxJS)
* **Routing:** Angular Router with functional guards (`authGuard`, `adminGuard`) and route resolvers
* **Forms:** Angular `ReactiveFormsModule` & `FormsModule`
* **Icons:** Font Awesome 6.5.1
* **Styling:** Custom Luxury Design System + Bootstrap 5 utility foundation

---

## 🚀 Getting Started

### 1. Prerequisites
* Node.js (v18+)
* Angular CLI (`npm install -g @angular/cli`)
* Backend API running on `http://localhost:3000`

### 2. Installation
```bash
cd Front-E-Commerce
npm install
```

### 3. Running Development Server
```bash
npm start
# Or using ng directly:
# ng serve --port 4200
```
Navigate your browser to `http://localhost:4200`.

### 4. Production Build
```bash
npm run build
```
The compiled output will be generated in `dist/front-e-commerce`.

---

## 👥 Demo Credentials

* **Admin Access:** `admin@store.com` / `admin123456`
* **Customer Access:** `ahmed@gmail.com` / `user123456`

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).

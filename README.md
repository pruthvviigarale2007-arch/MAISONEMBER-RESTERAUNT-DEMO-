# Maison Ember — Open-Hearth Cooking & Natural Cellar (Paris 4e)

> **Full-Stack Restaurant Web Application**  
> Elegant editorial frontend connected to a robust, real-time Node.js + Express + SQLite backend.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/pruthvviigarale2007-arch/MAISONEMBER-RESTERAUNT-DEMO-)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/pruthvviigarale2007-arch/MAISONEMBER-RESTERAUNT-DEMO-)

---

## 🍽️ Overview

**Maison Ember** is an open-hearth culinary atelier and biodynamic cellar restaurant in Paris 4e. This full-stack application connects the client-facing front-end to an operational hospitality backend, including:

- **Real-Time Table Reservation Suite:** Dynamic availability engine calculating slot capacity per seating area (Main Dining Room, Hearth Counter, Wine Vault Salon), generating unique reference numbers (`#EMB-8492`), and providing instant Google Calendar and Apple/iCal (.ics) exports.
- **Dynamic Seasonal Carte:** Live menu populated from the backend database across all 5 categories (*Starters & Crudo*, *Wood-Fired Mains*, *Sides from the Ash*, *Cheeses & Desserts*, *Selected Cellar*).
- **Guestbook & Ember Journal:** Newsletter subscription system with validation and persistence.
- **Private Dining Salon Inquiries:** Booking inquiry pipeline for vaulted cellar takeovers and full-restaurant buyouts.
- **Staff Atelier Desk (`/admin`):** Complete management console for restaurant staff to seat patrons, complete service, cancel bookings, view covers metrics, toggle 86'd menu items, and process salon inquiries.
- **Zero-Config Persistent Database:** Auto-initialized SQLite database (`data/maison_ember.db`) seeded with realistic dishes, holding records, and test bookings.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18+ recommended; supports Node 20, 22, and 24+)
- **npm** (included with Node.js)

### Installation & Run

1. **Extract the ZIP file** to any folder on your computer.
2. Open a terminal / command prompt in that directory and run:

```bash
# Install dependencies (only express and cors)
npm install

# Start the restaurant server
npm start
```

*Or on Windows:* simply double-click **`start.bat`**.

3. **Open in your browser:**
- **Guest Experience:** [http://localhost:3000/](http://localhost:3000/)
- **Staff Atelier Desk:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **API Health & Overview:** [http://localhost:3000/api](http://localhost:3000/api)

---

## 🧪 Running Automated Tests

Run the built-in API integration test suite:

```bash
npm test
```

Verifies all endpoints:
- `GET /api`
- `GET /api/menu`
- `GET /api/reservations/availability`
- `POST /api/reservations`
- `PATCH /api/reservations/:id/status`
- `POST /api/newsletter`
- `POST /api/inquiries`
- `GET /api/stats`

---

## 📐 Architecture & Project Structure

```
maison-ember-restaurant/
├── public/                     # Frontend static assets
│   ├── index.html              # Guest frontend (connected to backend APIs)
│   ├── admin.html              # Staff table desk & management console
│   ├── css/
│   │   └── custom.css          # Modals, toasts, print stylesheet
│   └── js/
│       ├── app.js              # Client connector (availability, booking, menu)
│       └── admin.js            # Admin controller (table operations, menu edit)
├── src/                        # Backend application
│   ├── server.js               # Express server configuration & route mounting
│   ├── db.js                   # SQLite database setup, schema, and seeding
│   └── routes/
│       ├── reservations.js     # Table booking & availability logic
│       ├── menu.js             # Seasonal carte API & item management
│       ├── newsletter.js       # Journal subscriptions
│       ├── inquiries.js        # Private salon inquiries
│       └── stats.js            # Operations overview & covers counter
├── data/
│   └── maison_ember.db         # Persistent SQLite database file
├── test/
│   └── api.test.js             # Automated API integration test suite
├── start.bat                   # Windows one-click start script
├── start.sh                    # macOS / Linux start script
├── package.json                # Project dependencies and npm scripts
└── README.md                   # Complete documentation
```

---

## 🔌 REST API Endpoints

### 1. Reservations
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reservations/availability?date=YYYY-MM-DD&area=...&party=...` | Computes remaining capacity for all sittings (Available, Last 2 tables, Committed) |
| `POST` | `/api/reservations` | Books table, validates fields, checks capacity, generates reference & calendar pass |
| `GET` | `/api/reservations` | Lists reservations with optional filters (`date`, `status`, `search`) |
| `GET` | `/api/reservations/:idOrRef` | Retrieves single booking by ID or Reference code (e.g. `EMB-8492`) |
| `PATCH` | `/api/reservations/:id/status` | Updates booking status (`confirmed`, `seated`, `completed`, `cancelled`) |
| `DELETE` | `/api/reservations/:id` | Deletes or archives booking record |

### 2. Seasonal Menu
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/menu?category=...` | Fetches dishes filtered by category (`starters`, `mains`, `sides`, `desserts`, `cellar`) |
| `POST` | `/api/menu` | Adds new dish (staff feature) |
| `PATCH` | `/api/menu/:id` | Updates price, details, or toggles 86'd / depleted status |
| `DELETE` | `/api/menu/:id` | Removes dish from carte |

### 3. Newsletter / Journal
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/newsletter` | Subscribes patron email to The Ember Journal |
| `GET` | `/api/newsletter` | Lists all subscribers (admin) |

### 4. Private Dining Inquiries
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/inquiries` | Submits private cellar salon / venue takeover request |
| `GET` | `/api/inquiries` | Lists private dining inquiries |
| `PATCH` | `/api/inquiries/:id/status` | Updates inquiry status (`pending`, `contacted`, `booked`) |

### 5. Operational Stats
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stats` | Returns real-time metrics: Tonight's covers, upcoming bookings, subscribers, pending inquiries |

---

## 🔒 Design System Fidelity

The frontend preserves 100% of the requested typographic and atmospheric styling:
- **Playfair Display** high-contrast headings
- **Work Sans** editorial body, numeral pricing, and uppercase labels
- Bespoke **Burnt Terracotta** (`#9E472A`), **Roasted Umber**, **Dry Thyme** (`#4A5240`), and **Antique Linen** (`#FFF8F5`) color harmony
- Dotted leader menu formatting (`title ........... €22`)
- Tactile broadsheet aesthetic honoring Parisian open-hearth bistros

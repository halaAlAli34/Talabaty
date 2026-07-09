# Talabaty (طلباتي) — MERN + TypeScript project structure

This is the base project structure for the Talabaty marketplace, matching the
MongoDB schema and RBAC (role-based access control) design discussed in the
BRD: one `users` collection with a `role` enum (`customer`, `partner`,
`admin`), a separate `partner_profiles` collection for vendor-specific data,
and `products`, `carts`, `orders` collections.

## Why the structure looks this way

- **No separate `admin` model.** Admin is a `role` value on `users`, not its
  own collection or Mongoose model — see the ERD discussion. Permission is
  enforced in `backend/src/middleware/roleMiddleware.ts`, not in the schema.
- **`authMiddleware.ts`** verifies the JWT and attaches `req.user = { id, role }`.
- **`roleMiddleware.ts`** exports `authorize(...roles)`, used like
  `authorize('admin')` or `authorize('partner', 'admin')` on protected routes.
- **Frontend `ProtectedRoute.tsx`** mirrors this on the client: it reads the
  decoded role from `AuthContext` and redirects if the role isn't allowed —
  this is a UX convenience only, the real enforcement is always on the backend.

## UI

The frontend now matches the approved mockups: a marketing landing page,
customer/partner signup, a login screen with cosmetic Customer/Partner/Admin
tabs (see "Login role tabs" below), an admin dashboard with customer/partner
tables, a partner panel ("My items" + "Orders"), and the customer shopping
flow (store detail → cart/checkout → order confirmation). Styling uses
Tailwind CSS with a palette matching the mockups (`brand` = blue,
`navy` = dark sidebar/footer, `teal` = success/rating accent).

### Login role tabs

The Login screen lets a person pick "Customer / Partner / Admin" before
entering credentials. This tab is sent to the backend as `role` in the
login request. `authController.login` checks it against the account's
*actual* `role` in the database and rejects the login (403) if they don't
match — so the tab is a UX convenience, not a security boundary; the real
check happens server-side, and a customer's correct password won't work
through the Admin tab.

## Folder layout

```
talabaty/
├── backend/                     Express + TypeScript API
│   ├── src/
│   │   ├── config/db.ts         MongoDB connection
│   │   ├── models/               Mongoose schemas (User, PartnerProfile, Product, Cart, Order)
│   │   ├── controllers/          Route handler logic
│   │   ├── routes/               Express routers
│   │   ├── middleware/           authMiddleware, roleMiddleware, errorMiddleware
│   │   ├── utils/generateToken.ts
│   │   ├── types/express.d.ts    Augments Express Request with req.user
│   │   ├── app.ts                Express app + route mounting
│   │   └── server.ts             Entry point, connects DB, starts server
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                    React + TypeScript (Vite)
    ├── src/
    │   ├── api/axiosInstance.ts  Axios instance, attaches JWT to requests
    │   ├── context/AuthContext.tsx
    │   ├── components/           Navbar, ProtectedRoute
    │   ├── pages/                Login, Register, Home, ProductList, Cart,
    │   │                         Orders, PartnerDashboard, AdminDashboard
    │   ├── types/index.ts        Shared TS interfaces (User, Role, Product...)
    │   ├── App.tsx                Routes
    │   └── main.tsx
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

## Getting started

```bash
# backend
cd backend
npm install
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET
npm run dev

# frontend (separate terminal)
cd frontend
npm install
npm run dev
```

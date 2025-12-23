# 🏗️ FutureLabs Project Architecture

## 📊 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FUTURELAB PLATFORM                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────┐         ┌────────────────────┐         │
│  │   USER INTERFACE   │         │  ADMIN DASHBOARD   │         │
│  │                    │         │                    │         │
│  │ ✅ Home            │         │ ✅ Dashboard       │         │
│  │ ✅ Tests           │         │ ✅ Tests Manager   │         │
│  │ ✅ Packages        │         │ ✅ Package Manager │         │
│  │ ✅ Cart            │         │ ✅ Category Mgr    │         │
│  │ ✅ Checkout        │         │ ✅ Order Manager   │         │
│  │ ✅ Categories      │         │ ❌ User Manager    │         │
│  │ ✅ Special Offers  │         │ ❌ Banner Manager  │         │
│  │ ✅ Profile         │         │ ❌ Location Mgr    │         │
│  │                    │         │ ❌ Reports         │         │
│  └────────────────────┘         └────────────────────┘         │
│           │                              │                       │
│           └──────────────┬───────────────┘                       │
│                          │                                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                           │ HTTP/HTTPS
                           │ (Axios)
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                          ▼                                       │
│                   API GATEWAY                                    │
│                  (Express.js)                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    MIDDLEWARE                            │   │
│  │  • Authentication (JWT)                                  │   │
│  │  • Authorization (Role-based)                            │   │
│  │  • Error Handling                                        │   │
│  │  • Advanced Results (Pagination, Filtering)              │   │
│  │  • CORS                                                  │   │
│  │  • Security (Helmet)                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  API ROUTES                              │   │
│  │                                                          │   │
│  │  ✅ /api/v1/auth          - Authentication              │   │
│  │  ✅ /api/v1/tests         - Test Management             │   │
│  │  ✅ /api/v1/packages      - Package Management          │   │
│  │  ✅ /api/v1/categories    - Category Management         │   │
│  │  ✅ /api/v1/orders        - Order Management            │   │
│  │  ✅ /api/v1/cart          - Cart Operations             │   │
│  │  ✅ /api/v1/banners       - Banner Management           │   │
│  │  ✅ /api/v1/locations     - Location Management         │   │
│  │  ❌ /api/v1/users         - User Management (NEEDED)    │   │
│  │  ❌ /api/v1/reports       - Reports (NEEDED)            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  CONTROLLERS                             │   │
│  │                                                          │   │
│  │  ✅ auth.js          - Login, Register, OTP             │   │
│  │  ✅ tests.js         - CRUD for Tests                   │   │
│  │  ✅ packages.js      - CRUD for Packages                │   │
│  │  ✅ categories.js    - CRUD for Categories              │   │
│  │  ✅ orders.js        - CRUD for Orders + Stats          │   │
│  │  ✅ cart.js          - Cart Operations                  │   │
│  │  ✅ banners.js       - CRUD for Banners                 │   │
│  │  ✅ locations.js     - CRUD for Locations               │   │
│  │  ❌ users.js         - User Management (NEEDED)         │   │
│  │  ❌ reports.js       - Analytics (NEEDED)               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           │ Mongoose ODM
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                          ▼                                       │
│                   DATABASE LAYER                                 │
│                  (MongoDB)                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    MODELS                                │   │
│  │                                                          │   │
│  │  ✅ User.js          - User schema                      │   │
│  │  ✅ Test.js          - Test schema                      │   │
│  │  ✅ Package.js       - Package schema                   │   │
│  │  ✅ Category.js      - Category schema                  │   │
│  │  ✅ Order.js         - Order schema                     │   │
│  │  ✅ Cart.js          - Cart schema                      │   │
│  │  ✅ Banner.js        - Banner schema                    │   │
│  │  ✅ Location.js      - Location schema                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  COLLECTIONS                             │   │
│  │                                                          │   │
│  │  • users           - User accounts                       │   │
│  │  • tests           - Lab tests                           │   │
│  │  • packages        - Health packages                     │   │
│  │  • categories      - Test categories                     │   │
│  │  • orders          - Customer orders                     │   │
│  │  • carts           - Shopping carts                      │   │
│  │  • banners         - Promotional banners                 │   │
│  │  • locations       - Lab locations                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ SMS Service (BhashSMS)    - OTP verification                │
│  ❌ Email Service (Nodemailer) - Order confirmations (NEEDED)   │
│  ❌ Cloud Storage (Cloudinary) - Image uploads (NEEDED)         │
│  ❌ Payment Gateway            - Payment processing (NEEDED)    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
futurelab-main/
│
├── backend/                          # Backend (Node.js + Express)
│   ├── controllers/                  # Business logic
│   │   ✅ auth.js                    # Authentication
│   │   ✅ tests.js                   # Test management
│   │   ✅ packages.js                # Package management
│   │   ✅ categories.js              # Category management
│   │   ✅ orders.js                  # Order management
│   │   ✅ cart.js                    # Cart operations
│   │   ✅ banners.js                 # Banner management
│   │   ✅ locations.js               # Location management
│   │   ❌ users.js                   # User management (NEEDED)
│   │   ❌ reports.js                 # Analytics (NEEDED)
│   │
│   ├── models/                       # Database schemas
│   │   ✅ User.js                    # User model
│   │   ✅ Test.js                    # Test model
│   │   ✅ Package.js                 # Package model
│   │   ✅ Category.js                # Category model
│   │   ✅ Order.js                   # Order model
│   │   ✅ Cart.js                    # Cart model
│   │   ✅ Banner.js                  # Banner model
│   │   ✅ Location.js                # Location model
│   │
│   ├── routes/                       # API routes
│   │   ✅ auth.js                    # Auth routes
│   │   ✅ tests.js                   # Test routes
│   │   ✅ packages.js                # Package routes
│   │   ✅ categories.js              # Category routes
│   │   ✅ orders.js                  # Order routes
│   │   ✅ cart.js                    # Cart routes
│   │   ✅ banners.js                 # Banner routes
│   │   ✅ locations.js               # Location routes
│   │   ❌ users.js                   # User routes (NEEDED)
│   │   ❌ reports.js                 # Report routes (NEEDED)
│   │
│   ├── middleware/                   # Custom middleware
│   │   ✅ auth.js                    # JWT authentication
│   │   ✅ error.js                   # Error handling
│   │   ✅ advancedResults.js         # Pagination/filtering
│   │   ✅ async.js                   # Async handler
│   │
│   ├── utils/                        # Utility functions
│   │   ✅ sendSMS.js                 # SMS service
│   │   ❌ sendEmail.js               # Email service (NEEDED)
│   │
│   ├── server.js                     # Main server file
│   └── package.json                  # Dependencies
│
├── frontend/                         # Frontend (React)
│   ├── src/
│   │   ├── admin/                    # Admin dashboard
│   │   │   ✅ AdminDashboard.jsx     # Main dashboard
│   │   │   ✅ AdminLogin.jsx         # Admin login
│   │   │   ✅ AdminAuthWrapper.jsx   # Auth protection
│   │   │   ✅ TestManager.jsx        # Test management
│   │   │   ✅ PackageManager.jsx     # Package management
│   │   │   ✅ CategoryManager.jsx    # Category management
│   │   │   ✅ OrderManager.jsx       # Order management
│   │   │   ❌ UserManager.jsx        # User management (NEEDED)
│   │   │   ❌ BannerManager.jsx      # Banner management (NEEDED)
│   │   │   ❌ LocationManager.jsx    # Location management (NEEDED)
│   │   │   ❌ ReportsManager.jsx     # Reports (NEEDED)
│   │   │   ✅ AdminDashboard.css     # Styles
│   │   │
│   │   ├── pages/                    # User-facing pages
│   │   │   ✅ Home.jsx               # Homepage
│   │   │   ✅ Cart.jsx               # Shopping cart
│   │   │   ✅ Checkups.jsx           # Health checkups
│   │   │   ✅ Package.jsx            # Package details
│   │   │   ✅ Product.jsx            # Product details
│   │   │   ✅ SingleTest.jsx         # Test details
│   │   │   ✅ WomanCare.jsx          # Women's health
│   │   │   ✅ MenCare.jsx            # Men's health
│   │   │   ✅ SpecialCare.jsx        # Special care
│   │   │   ✅ VitalOrgan.jsx         # Vital organs
│   │   │   ✅ LifestyleCheckup.jsx   # Lifestyle
│   │   │   ✅ CreatePackage.jsx      # Create package
│   │   │   ✅ Completehealth.jsx     # Complete health
│   │   │   ✅ SpecialOffers.jsx      # Special offers
│   │   │   ✅ ErrorPage.jsx          # 404 page
│   │   │   ✅ PrivacyPolicy.jsx      # Privacy policy
│   │   │   ✅ TermsAndConditions.jsx # Terms
│   │   │   ✅ Sitemap.jsx            # Sitemap
│   │   │
│   │   ├── components/               # Reusable components
│   │   │   ✅ Header.jsx             # Header/navbar
│   │   │   ✅ Footer.jsx             # Footer
│   │   │   ✅ ScrollToTop.jsx        # Scroll utility
│   │   │   ❌ ImageUpload.jsx        # Image upload (NEEDED)
│   │   │
│   │   ├── utils/                    # Utility functions
│   │   │   ✅ api.js                 # API helpers
│   │   │
│   │   ├── App.js                    # Main app component
│   │   ├── index.js                  # Entry point
│   │   └── index.css                 # Global styles
│   │
│   └── package.json                  # Dependencies
│
├── PROJECT_ANALYSIS.md               # ✅ Detailed analysis
├── IMPLEMENTATION_GUIDE.md           # ✅ Step-by-step guide
├── PROJECT_SUMMARY.md                # ✅ Executive summary
├── CHECKLIST.md                      # ✅ Progress tracker
├── ARCHITECTURE.md                   # ✅ This file
└── README.md                         # ✅ Project overview
```

---

## 🔄 Data Flow Diagram

### User Registration Flow
```
User → Frontend → POST /api/v1/auth/register
                    ↓
              Validate Input
                    ↓
              Hash Password
                    ↓
              Create User in DB
                    ↓
              Generate JWT Token
                    ↓
              Return Token + User Data
                    ↓
              Frontend stores token
                    ↓
              Redirect to Dashboard
```

### Order Creation Flow
```
User adds items to cart
        ↓
User proceeds to checkout
        ↓
Frontend → POST /api/v1/orders
        ↓
Validate cart items
        ↓
Calculate total price
        ↓
Create order in DB
        ↓
Update user's orders
        ↓
Send confirmation (SMS/Email)
        ↓
Return order details
        ↓
Frontend shows success
```

### Admin Dashboard Flow
```
Admin Login
    ↓
Verify credentials
    ↓
Generate admin JWT
    ↓
Load Admin Dashboard
    ↓
Fetch stats from /api/v1/orders/stats
    ↓
Display dashboard with charts
    ↓
Admin performs CRUD operations
    ↓
Update database
    ↓
Refresh dashboard data
```

---

## 🔐 Authentication Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. Login Request
       │ (phone + password)
       ▼
┌─────────────────┐
│   Auth API      │
│ /api/v1/auth    │
└──────┬──────────┘
       │
       │ 2. Validate Credentials
       ▼
┌─────────────────┐
│   Database      │
│   (MongoDB)     │
└──────┬──────────┘
       │
       │ 3. User Found
       ▼
┌─────────────────┐
│  JWT Generator  │
└──────┬──────────┘
       │
       │ 4. Generate Token
       │ (includes user id, role)
       ▼
┌─────────────────┐
│   Client        │
│ (Store token)   │
└──────┬──────────┘
       │
       │ 5. Subsequent Requests
       │ (Include token in header)
       ▼
┌─────────────────┐
│  Auth Middleware│
└──────┬──────────┘
       │
       │ 6. Verify Token
       ▼
┌─────────────────┐
│  Protected Route│
└─────────────────┘
```

---

## 📊 Database Schema Relationships

```
┌──────────────┐
│    User      │
│──────────────│
│ _id          │◄─────────┐
│ name         │          │
│ email        │          │
│ phone        │          │
│ password     │          │
│ role         │          │
│ isVerified   │          │
│ cart[]       │          │
│ orders[]     │          │
└──────────────┘          │
                          │
                          │ user_id
                          │
┌──────────────┐          │
│    Order     │          │
│──────────────│          │
│ _id          │          │
│ user         │──────────┘
│ orderItems[] │
│ totalPrice   │
│ orderStatus  │
│ isPaid       │
│ isDelivered  │
└──────────────┘

┌──────────────┐
│    Test      │
│──────────────│
│ _id          │◄─────────┐
│ name         │          │
│ description  │          │
│ category     │          │
│ price        │          │
│ isActive     │          │
└──────────────┘          │
                          │
                          │ testId
                          │
┌──────────────┐          │
│   Package    │          │
│──────────────│          │
│ _id          │          │
│ name         │          │
│ description  │          │
│ includedTests│──────────┘
│ price        │
│ isActive     │
└──────────────┘

┌──────────────┐
│  Category    │
│──────────────│
│ _id          │
│ name         │
│ description  │
│ icon         │
│ isActive     │
└──────────────┘

┌──────────────┐
│   Banner     │
│──────────────│
│ _id          │
│ title        │
│ description  │
│ imageUrl     │
│ bannerType   │
│ isActive     │
│ displayOrder │
└──────────────┘

┌──────────────┐
│  Location    │
│──────────────│
│ _id          │
│ name         │
│ address      │
│ city         │
│ pincode      │
│ isActive     │
└──────────────┘
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCTION                            │
└─────────────────────────────────────────────────────────┘

┌─────────────────┐         ┌─────────────────┐
│   Netlify/      │         │   Heroku/       │
│   Vercel        │         │   Railway       │
│                 │         │                 │
│  React Frontend │◄───────►│  Express API    │
│  (Static Files) │  HTTPS  │  (Node.js)      │
└─────────────────┘         └────────┬────────┘
                                     │
                                     │ MongoDB
                                     │ Connection
                                     ▼
                            ┌─────────────────┐
                            │  MongoDB Atlas  │
                            │   (Database)    │
                            └─────────────────┘

┌─────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                           │
├─────────────────────────────────────────────────────────┤
│  • Cloudinary (Image Storage)                           │
│  • BhashSMS (SMS Service)                               │
│  • SendGrid/Mailgun (Email Service)                     │
│  • Razorpay/Stripe (Payment Gateway)                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Technology Stack Details

### Frontend
```
React 18.2.0
├── react-router-dom (Routing)
├── axios (HTTP Client)
├── recharts (Charts)
├── react-feather (Icons)
└── Bootstrap 5.3.8 (CSS Framework)
```

### Backend
```
Node.js + Express.js
├── mongoose (MongoDB ODM)
├── jsonwebtoken (JWT Auth)
├── bcryptjs (Password Hashing)
├── helmet (Security)
├── cors (Cross-Origin)
├── express-rate-limit (Rate Limiting)
└── dotenv (Environment Variables)
```

### Database
```
MongoDB
├── users collection
├── tests collection
├── packages collection
├── categories collection
├── orders collection
├── carts collection
├── banners collection
└── locations collection
```

---

## 📈 Performance Considerations

### Frontend Optimizations
- ✅ Code splitting with React.lazy
- ✅ Image lazy loading
- ❌ Service Worker for caching (NEEDED)
- ❌ CDN for static assets (NEEDED)

### Backend Optimizations
- ✅ Database indexing
- ✅ Pagination for large datasets
- ❌ Redis caching (NEEDED)
- ❌ Response compression (NEEDED)

### Database Optimizations
- ✅ Indexed fields (email, phone, category)
- ✅ Compound indexes for queries
- ❌ Database replication (NEEDED)
- ❌ Sharding for scalability (NEEDED)

---

## 🔒 Security Measures

### Implemented ✅
- JWT authentication
- Password hashing (bcrypt)
- CORS configuration
- Helmet security headers
- Input validation
- Role-based access control

### Needed ❌
- Rate limiting on all routes
- SQL injection prevention
- XSS protection
- CSRF tokens
- API key rotation
- Security audit

---

## 📊 Scalability Plan

### Current Capacity
- Handles ~1000 concurrent users
- ~10,000 tests in database
- ~5,000 orders per month

### Future Scaling
- Load balancer for multiple instances
- Database sharding
- Redis caching layer
- CDN for static content
- Microservices architecture

---

**Document Version:** 1.0
**Last Updated:** December 6, 2025
**Maintained By:** Development Team

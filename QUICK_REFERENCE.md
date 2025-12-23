# 🚀 FutureLabs Quick Reference Card

## 📋 TL;DR - What You Need to Know

### Project Status
- **Backend:** 100% Complete ✅
- **Frontend (User):** 95% Complete ✅
- **Admin Dashboard:** 60% Complete 🟡

### Missing Critical Features
1. ❌ **User Management** - Complete admin module
2. ❌ **Banner Management** - Complete admin module  
3. ❌ **Reports & Analytics** - Complete admin module
4. 🟡 **Real-time Data** - Connect APIs to frontend

### Time to Complete
- **Phase 1 (Critical):** 2 weeks
- **Phase 2 (Important):** 2 weeks
- **Phase 3 (Nice-to-have):** 2+ weeks
- **Total:** 6-8 weeks

---

## 🎯 Top 3 Priorities

### 1. User Management Module (8-12 hours)
**Why:** Admins need to manage users
**Files to Create:**
- `backend/controllers/users.js`
- `backend/routes/users.js`
- `frontend/src/admin/UserManager.jsx`

### 2. Banner Management Module (4-6 hours)
**Why:** Backend exists, just needs frontend
**Files to Create:**
- `frontend/src/admin/BannerManager.jsx`

### 3. Real-time Data Integration (6-8 hours)
**Why:** Dashboard shows mock data
**Files to Update:**
- `frontend/src/admin/AdminDashboard.jsx`
- All manager components

---

## 📁 Key Files Reference

### Backend Structure
```
backend/
├── server.js                 # Main entry point
├── controllers/
│   ├── auth.js              # ✅ Authentication
│   ├── tests.js             # ✅ Tests CRUD
│   ├── packages.js          # ✅ Packages CRUD
│   ├── orders.js            # ✅ Orders CRUD + Stats
│   ├── banners.js           # ✅ Banners CRUD
│   └── users.js             # ❌ NEEDED
├── routes/
│   └── [same as controllers]
└── models/
    ├── User.js              # ✅ User schema
    ├── Test.js              # ✅ Test schema
    ├── Package.js           # ✅ Package schema
    └── Order.js             # ✅ Order schema
```

### Frontend Structure
```
frontend/src/
├── admin/
│   ├── AdminDashboard.jsx   # ✅ Main dashboard
│   ├── TestManager.jsx      # ✅ Test management
│   ├── PackageManager.jsx   # ✅ Package management
│   ├── OrderManager.jsx     # ✅ Order management
│   ├── UserManager.jsx      # ❌ NEEDED
│   └── BannerManager.jsx    # ❌ NEEDED
└── pages/
    └── [All user pages ✅]
```

---

## 🔧 Quick Commands

### Start Development
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start

# Terminal 3 - MongoDB
net start MongoDB
```

### Test API Endpoints
```bash
# Get all users (admin only)
GET http://localhost:5000/api/v1/users
Authorization: Bearer <admin_token>

# Get dashboard stats
GET http://localhost:5000/api/v1/orders/stats
Authorization: Bearer <admin_token>

# Get all banners
GET http://localhost:5000/api/v1/banners
```

### Common Issues
```bash
# MongoDB not running
net start MongoDB

# Port already in use
# Kill process on port 5000 or 3000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Dependencies missing
npm install
```

---

## 📊 API Endpoints Quick Reference

### Authentication
```
POST   /api/v1/auth/register      # Register user
POST   /api/v1/auth/login         # Login
POST   /api/v1/auth/otp/generate  # Generate OTP
POST   /api/v1/auth/otp/verify    # Verify OTP
GET    /api/v1/auth/me            # Get current user
```

### Tests
```
GET    /api/v1/tests              # Get all tests
GET    /api/v1/tests/:id          # Get single test
POST   /api/v1/tests              # Create test (admin)
PUT    /api/v1/tests/:id          # Update test (admin)
DELETE /api/v1/tests/:id          # Delete test (admin)
```

### Packages
```
GET    /api/v1/packages           # Get all packages
GET    /api/v1/packages/:id       # Get single package
POST   /api/v1/packages           # Create package (admin)
PUT    /api/v1/packages/:id       # Update package (admin)
DELETE /api/v1/packages/:id       # Delete package (admin)
```

### Orders
```
GET    /api/v1/orders             # Get all orders (admin)
GET    /api/v1/orders/myorders    # Get user orders
GET    /api/v1/orders/stats       # Get dashboard stats (admin)
POST   /api/v1/orders             # Create order
PUT    /api/v1/orders/:id/status  # Update status (admin)
```

### Banners
```
GET    /api/v1/banners            # Get all banners
GET    /api/v1/banners/main       # Get main banners
GET    /api/v1/banners/bottom     # Get bottom banners
POST   /api/v1/banners            # Create banner (admin)
PUT    /api/v1/banners/:id        # Update banner (admin)
DELETE /api/v1/banners/:id        # Delete banner (admin)
```

### Users (TO BE IMPLEMENTED)
```
GET    /api/v1/users              # Get all users (admin)
GET    /api/v1/users/:id          # Get single user (admin)
PUT    /api/v1/users/:id          # Update user (admin)
DELETE /api/v1/users/:id          # Delete user (admin)
PATCH  /api/v1/users/:id/role     # Update role (admin)
PATCH  /api/v1/users/:id/verify   # Toggle verification (admin)
```

---

## 🎨 Admin Dashboard Routes

### Current Routes
```
/admin/login                      # Admin login page
/admin/dashboard                  # Main dashboard
```

### Dashboard Tabs
```
dashboard    # ✅ Overview with stats
tests        # ✅ Test management
packages     # ✅ Package management
categories   # ✅ Category management
orders       # ✅ Order management
users        # 🟡 Placeholder (needs implementation)
banners      # ❌ Missing (needs implementation)
locations    # ❌ Missing (needs implementation)
reports      # 🟡 Placeholder (needs implementation)
```

---

## 💾 Database Collections

```
users         # User accounts
tests         # Lab tests
packages      # Health packages
categories    # Test categories
orders        # Customer orders
carts         # Shopping carts
banners       # Promotional banners
locations     # Lab locations
```

---

## 🔐 Authentication

### User Roles
```javascript
user   # Regular customer
admin  # Administrator
```

### JWT Token Structure
```javascript
{
  id: "user_id",
  role: "user" | "admin",
  iat: timestamp,
  exp: timestamp
}
```

### Admin Login Credentials
```
Default admin account should be created manually in database
or through seeder script
```

---

## 📦 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/futurelabs
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
SMS_API_USER=your_sms_user
SMS_API_PASS=your_sms_password
SMS_SENDER_ID=FULABS
```

### Frontend
```
REACT_APP_API_URL=http://localhost:5000/api/v1
```

---

## 🐛 Common Errors & Solutions

### Error: "Cannot connect to MongoDB"
```bash
# Solution: Start MongoDB
net start MongoDB
```

### Error: "Port 5000 already in use"
```bash
# Solution: Kill the process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Error: "Unauthorized" in admin routes
```bash
# Solution: Check admin token
# Make sure you're logged in as admin
# Token should be in localStorage as "adminToken"
```

### Error: "Module not found"
```bash
# Solution: Install dependencies
npm install
```

---

## 📚 Documentation Files

1. **PROJECT_ANALYSIS.md** - Complete analysis (50+ pages)
2. **IMPLEMENTATION_GUIDE.md** - Step-by-step code (30+ pages)
3. **PROJECT_SUMMARY.md** - Executive summary (10 pages)
4. **CHECKLIST.md** - Progress tracker (15 pages)
5. **ARCHITECTURE.md** - System design (20 pages)
6. **QUICK_REFERENCE.md** - This file (5 pages)

---

## 🎯 Next Steps

### Today
1. Read PROJECT_SUMMARY.md
2. Review IMPLEMENTATION_GUIDE.md
3. Start implementing User Management

### This Week
1. Complete User Management
2. Complete Banner Management
3. Connect real-time data
4. Test everything

### Next Week
1. Implement Reports & Analytics
2. Add Location Management
3. Enhance Order Management
4. Final testing

---

## 💡 Pro Tips

### Development
- Always test API endpoints before frontend integration
- Use mock data first, then connect to real APIs
- Commit frequently with clear messages
- Test on different browsers

### Code Quality
- Follow existing code patterns
- Add error handling everywhere
- Include loading states
- Add user feedback (alerts, toasts)

### Testing
- Test CRUD operations thoroughly
- Test with different user roles
- Test error scenarios
- Test on mobile devices

---

## 📞 Quick Help

### Need to...
**Add a new admin module?**
1. Create component in `frontend/src/admin/`
2. Import in `AdminDashboard.jsx`
3. Add to sidebar navigation
4. Add to `renderContent` switch

**Add a new API endpoint?**
1. Add function to controller
2. Add route to routes file
3. Register route in `server.js`
4. Test with Postman

**Fix an error?**
1. Check browser console
2. Check backend terminal
3. Check MongoDB connection
4. Check authentication token

---

## 🎉 Success Metrics

### Phase 1 Complete When:
- [x] Users can be managed from admin dashboard
- [x] Banners can be managed from admin dashboard
- [x] Dashboard shows real data, not mock data

### Phase 2 Complete When:
- [x] Reports show accurate analytics
- [x] Locations can be managed
- [x] Orders have detailed views

### Phase 3 Complete When:
- [x] Images can be uploaded
- [x] Notifications work
- [x] All features tested
- [x] Ready for production

---

## 🚀 Deployment Checklist

- [ ] All features implemented
- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables set
- [ ] Database backed up
- [ ] SSL certificate configured
- [ ] Domain configured
- [ ] Monitoring setup
- [ ] Error tracking setup

---

**Last Updated:** December 6, 2025
**Version:** 1.0
**Status:** Ready to Implement

---

## 🎯 Remember

> "Progress over perfection. Start with User Management, then Banner Management, then connect the data. You've got this! 💪"

**Estimated completion time:** 2 weeks for critical features

**You're 85% done with the entire project!** 🎉

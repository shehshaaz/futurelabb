# 🔧 MongoDB Atlas Connection Setup Guide

## ✅ Your MongoDB Atlas Credentials

**Username:** `futurelabsdesign@gmail.com`  
**Password:** `Fazil@2025Kerala`

---

## 🚀 Quick Setup Instructions

### Step 1: Create .env File

Create a file named `.env` in the `backend` folder with this content:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://futurelabsdesign:Fazil%402025Kerala@cluster0.mongodb.net/futurelabs?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=futurelab_super_secret_jwt_key_2025_secure_random_string_12345
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# SMS Configuration (BhashSMS)
SMS_API_USER=your_sms_api_user
SMS_API_PASS=your_sms_api_password
SMS_SENDER_ID=FULABS

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=futurelabsdesign@gmail.com
EMAIL_PASS=your_app_specific_password

# Razorpay Configuration (Optional)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## 📝 Important Notes

### Password Encoding
Your password contains special characters (`@`), so it's URL-encoded in the connection string:
- Original: `Fazil@2025Kerala`
- Encoded: `Fazil%402025Kerala`
- The `@` symbol becomes `%40`

### MongoDB Atlas Cluster
The connection string assumes your cluster is named `cluster0`. If different, update it:
```
mongodb+srv://username:password@YOUR_CLUSTER_NAME.mongodb.net/futurelabs
```

---

## 🔍 How to Find Your MongoDB Atlas Cluster Name

1. Go to https://cloud.mongodb.com/
2. Login with `futurelabsdesign@gmail.com`
3. Click on your cluster
4. Click "Connect"
5. Choose "Connect your application"
6. Copy the connection string
7. It will look like: `mongodb+srv://username:password@clusterXXXXX.xxxxx.mongodb.net/`

---

## 🛠️ Manual Setup Steps

### Option 1: Using Command Line

```bash
# Navigate to backend folder
cd backend

# Create .env file (Windows)
echo. > .env

# Open in notepad
notepad .env
```

Then paste the configuration above.

### Option 2: Using VS Code

1. Open VS Code
2. Navigate to `backend` folder
3. Right-click → New File
4. Name it `.env`
5. Paste the configuration above
6. Save the file

### Option 3: Using File Explorer

1. Open `backend` folder in File Explorer
2. Right-click → New → Text Document
3. Rename to `.env` (remove .txt extension)
4. Open with Notepad
5. Paste the configuration above
6. Save and close

---

## ✅ Verify Connection

After creating the `.env` file, test the connection:

```bash
cd backend
npm start
```

You should see:
```
✅ MongoDB connected successfully: cluster0-xxxxx.mongodb.net
🚀 Server running on port 5000
```

---

## 🔒 Security Reminders

1. ✅ `.env` file is already in `.gitignore` - Good!
2. ✅ Never commit `.env` to GitHub
3. ✅ Keep your credentials private
4. ✅ Use environment variables in production

---

## 🐛 Troubleshooting

### Error: "Authentication failed"
- Check username and password are correct
- Ensure password is URL-encoded (`%40` for `@`)
- Verify MongoDB Atlas user exists

### Error: "Network timeout"
- Check your internet connection
- Verify MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)
- Check firewall settings

### Error: "Database not found"
- Database will be created automatically on first write
- No action needed

### Error: "Cannot find module dotenv"
```bash
cd backend
npm install dotenv
```

---

## 📊 MongoDB Atlas Setup Checklist

- [ ] Create MongoDB Atlas account (already done ✅)
- [ ] Create cluster (already done ✅)
- [ ] Create database user with credentials
- [ ] Whitelist IP addresses (0.0.0.0/0 for all IPs)
- [ ] Get connection string
- [ ] Create `.env` file in backend folder
- [ ] Add connection string to `.env`
- [ ] Test connection by starting server

---

## 🌐 MongoDB Atlas IP Whitelist

To allow connections from anywhere (for development):

1. Go to MongoDB Atlas Dashboard
2. Click "Network Access" in left sidebar
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere"
5. Click "Confirm"

This adds `0.0.0.0/0` to whitelist.

**Note:** For production, use specific IP addresses.

---

## 📁 File Location

```
futurelab-main/
└── backend/
    ├── .env          ← CREATE THIS FILE
    ├── server.js
    ├── package.json
    └── ...
```

---

## 🎯 Quick Copy-Paste

**For MongoDB Atlas Connection String:**
```
mongodb+srv://futurelabsdesign:Fazil%402025Kerala@cluster0.mongodb.net/futurelabs?retryWrites=true&w=majority
```

**Replace `cluster0` with your actual cluster name if different.**

---

## 🔄 Alternative: Local MongoDB

If you prefer local MongoDB instead of Atlas:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/futurelabs
```

Then start local MongoDB:
```bash
net start MongoDB
```

---

## 📞 Need Help?

### MongoDB Atlas Issues
- Support: https://www.mongodb.com/cloud/atlas/support
- Documentation: https://docs.atlas.mongodb.com/

### Connection String Format
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?options
```

- **USERNAME:** futurelabsdesign
- **PASSWORD:** Fazil%402025Kerala (URL-encoded)
- **CLUSTER:** cluster0 (or your cluster name)
- **DATABASE:** futurelabs

---

## ✨ Next Steps After Setup

1. Create `.env` file with the configuration above
2. Start backend server: `npm start`
3. Verify MongoDB connection in console
4. Start frontend: `cd frontend && npm start`
5. Test the application

---

**Created:** December 6, 2025  
**Status:** Ready to implement  
**Estimated Time:** 2-3 minutes

---

## 🎉 Summary

1. **Create** `.env` file in `backend` folder
2. **Copy** the configuration provided above
3. **Update** cluster name if needed
4. **Save** the file
5. **Start** the server
6. **Verify** connection successful

**Your MongoDB Atlas is ready to use!** 🚀

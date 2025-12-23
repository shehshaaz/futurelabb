# ✅ MongoDB Atlas Connection - SETUP COMPLETE

## 🎉 Configuration Created Successfully!

I've created the `.env` file in your `backend` folder with your MongoDB Atlas credentials.

---

## 📋 What Was Configured

### ✅ Created File: `backend/.env`

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://futurelabsdesign:Fazil%402025Kerala@cluster0.mongodb.net/futurelabs?retryWrites=true&w=majority
JWT_SECRET=futurelab_super_secret_jwt_key_2025_secure_random_string_12345
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
```

---

## 🔧 Important: Update Cluster Name

The connection string uses `cluster0` as a placeholder. You need to update it with your **actual MongoDB Atlas cluster name**.

### How to Find Your Cluster Name:

1. **Go to MongoDB Atlas:** https://cloud.mongodb.com/
2. **Login** with `futurelabsdesign@gmail.com`
3. **Click** on your cluster
4. **Click** "Connect" button
5. **Choose** "Connect your application"
6. **Copy** the connection string

It will look like:
```
mongodb+srv://futurelabsdesign:<password>@cluster12345.xxxxx.mongodb.net/
```

The part `cluster12345.xxxxx` is your cluster name.

### Update the .env file:

Open `backend/.env` and replace:
```
@cluster0.mongodb.net
```

With your actual cluster name:
```
@clusterXXXXX.xxxxx.mongodb.net
```

---

## 🌐 MongoDB Atlas Setup Checklist

Before the connection works, ensure these are done in MongoDB Atlas:

### 1. ✅ Create Database User
- Username: `futurelabsdesign` (or the one you created)
- Password: `Fazil@2025Kerala`
- Role: Read and write to any database

### 2. ✅ Whitelist IP Address
**Important:** Allow your IP or all IPs for testing

**Steps:**
1. Go to MongoDB Atlas Dashboard
2. Click **"Network Access"** in left sidebar
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (adds 0.0.0.0/0)
5. Click **"Confirm"**

**Without this, connection will fail!**

### 3. ✅ Get Correct Connection String
1. In MongoDB Atlas, click your cluster
2. Click **"Connect"**
3. Choose **"Connect your application"**
4. Select **"Node.js"** and version **"4.1 or later"**
5. Copy the connection string
6. Replace `<password>` with `Fazil%402025Kerala`
7. Replace `<dbname>` with `futurelabs`

---

## 🔍 Connection String Format

### Correct Format:
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER_NAME.xxxxx.mongodb.net/DATABASE?retryWrites=true&w=majority
```

### Your Details:
- **USERNAME:** `futurelabsdesign`
- **PASSWORD:** `Fazil%402025Kerala` (URL-encoded, `@` becomes `%40`)
- **CLUSTER_NAME:** Get from MongoDB Atlas (e.g., `cluster0.abc123`)
- **DATABASE:** `futurelabs`

### Example:
```
mongodb+srv://futurelabsdesign:Fazil%402025Kerala@cluster0.abc123.mongodb.net/futurelabs?retryWrites=true&w=majority
```

---

## 🚀 Test the Connection

### Step 1: Update Cluster Name
Edit `backend/.env` with your actual cluster name from MongoDB Atlas.

### Step 2: Start Backend Server
```bash
cd backend
npm start
```

### Expected Output (Success):
```
Attempting to connect to MongoDB...
✅ MongoDB connected successfully: cluster0.xxxxx.mongodb.net
🚀 Server running on port 5000
Health check endpoint: http://localhost:5000/api/v1/health
```

### If Connection Fails:
```
❌ MongoDB connection error: ...
```

**Common Issues:**
1. **Wrong cluster name** - Update in .env
2. **IP not whitelisted** - Add 0.0.0.0/0 in Network Access
3. **Wrong credentials** - Verify username/password
4. **Internet connection** - Check your network

---

## 🛠️ Quick Fix Commands

### Option 1: Use Local MongoDB (Alternative)
If MongoDB Atlas isn't working, use local MongoDB:

```bash
# Start local MongoDB
net start MongoDB

# Update .env
MONGODB_URI=mongodb://127.0.0.1:27017/futurelabs
```

### Option 2: Create New MongoDB Atlas User
If credentials don't work:

1. Go to MongoDB Atlas → Database Access
2. Click "Add New Database User"
3. Create new user with username/password
4. Update .env with new credentials

---

## 📝 Manual .env File Creation (If Needed)

If the .env file wasn't created properly:

### Windows Command Prompt:
```cmd
cd backend
echo NODE_ENV=development > .env
echo PORT=5000 >> .env
echo MONGODB_URI=mongodb+srv://futurelabsdesign:Fazil%%402025Kerala@YOUR_CLUSTER.mongodb.net/futurelabs?retryWrites=true^&w=majority >> .env
```

### PowerShell:
```powershell
cd backend
@"
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://futurelabsdesign:Fazil%402025Kerala@YOUR_CLUSTER.mongodb.net/futurelabs?retryWrites=true&w=majority
JWT_SECRET=futurelab_super_secret_jwt_key_2025
JWT_EXPIRE=7d
"@ | Out-File -FilePath .env -Encoding UTF8
```

### Or Use Notepad:
```cmd
cd backend
notepad .env
```
Then paste the configuration and save.

---

## 🔒 Security Notes

### ✅ Good Practices:
- `.env` file is in `.gitignore` ✅
- Credentials not committed to GitHub ✅
- Using environment variables ✅

### ⚠️ Important:
- Never share your `.env` file
- Never commit `.env` to GitHub
- Use different credentials for production
- Enable MongoDB Atlas IP whitelist in production

---

## 🐛 Troubleshooting Guide

### Error: "Authentication failed"
**Solution:**
1. Verify username is correct in MongoDB Atlas
2. Verify password is correct
3. Ensure password is URL-encoded (`@` → `%40`)
4. Check user has proper permissions

### Error: "Network timeout" or "Connection refused"
**Solution:**
1. Check internet connection
2. Whitelist IP in MongoDB Atlas Network Access
3. Add 0.0.0.0/0 for testing
4. Check firewall settings

### Error: "Server selection timed out"
**Solution:**
1. Verify cluster name is correct
2. Check MongoDB Atlas cluster is running
3. Ensure cluster region is accessible
4. Try different DNS (8.8.8.8)

### Error: "Cannot find module 'dotenv'"
**Solution:**
```bash
cd backend
npm install dotenv
```

---

## 📞 Next Steps

1. **Get your actual cluster name** from MongoDB Atlas
2. **Update** `backend/.env` with correct cluster name
3. **Whitelist IP** in MongoDB Atlas (0.0.0.0/0 for testing)
4. **Start server:** `npm start` in backend folder
5. **Verify** connection successful message

---

## 🎯 Quick Reference

### Your Credentials:
- **Email:** futurelabsdesign@gmail.com
- **Password:** Fazil@2025Kerala
- **Encoded Password:** Fazil%402025Kerala

### MongoDB Atlas:
- **Dashboard:** https://cloud.mongodb.com/
- **Database Name:** futurelabs
- **Cluster:** (Get from your Atlas dashboard)

### Files:
- **Config File:** `backend/.env`
- **Server File:** `backend/server.js`

---

## ✨ Summary

✅ **Created** `.env` file in backend folder  
✅ **Added** MongoDB Atlas connection string  
✅ **Configured** JWT and other settings  
⏳ **Need to:** Update cluster name from MongoDB Atlas  
⏳ **Need to:** Whitelist IP address (0.0.0.0/0)  
⏳ **Need to:** Test connection

---

**Status:** Configuration Created ✅  
**Next:** Update cluster name and test connection  
**Time:** 2-3 minutes to complete setup

---

**Created:** December 6, 2025  
**File Location:** `backend/.env`  
**Ready to use after updating cluster name!** 🚀

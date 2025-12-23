# 🔧 Quick Fix: MongoDB Connection Issue

## Problem Identified
Your `backend/.env` is configured to use **MongoDB Atlas** (cloud), but you have **MongoDB running locally** on your machine.

## Solution

### Option 1: Use Local MongoDB (Recommended - Fastest)

Update your `backend/.env` file and change the MONGODB_URI line to:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/futurelabs
```

**Steps:**
1. Open `backend/.env` in a text editor
2. Find the line starting with `MONGODB_URI=`
3. Replace it with: `MONGODB_URI=mongodb://127.0.0.1:27017/futurelabs`
4. Save the file
5. Restart your backend server

### Option 2: Use MongoDB Atlas (Cloud)

If you want to use MongoDB Atlas instead:

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up/Login
3. Create a free cluster
4. Create a database user
5. Get your connection string
6. Update `backend/.env` with your actual credentials

## Quick Test After Fix

```bash
# Restart backend
cd backend
npm run dev

# In another terminal, test the connection
curl http://localhost:5000/api/v1/health
```

You should see `"database": "connected"` instead of `"disconnected"`.

## Current Status

✅ **MongoDB Service:** Running locally  
✅ **Backend Server:** Running on port 5000  
❌ **Connection:** Backend trying to connect to Atlas, not local MongoDB  

## All Other Credentials

✅ **HDFC Payment:** Configured correctly (UAT credentials)  
✅ **JWT Secret:** Configured  
✅ **Server Configuration:** Correct  

**Only the MongoDB URI needs to be updated!**

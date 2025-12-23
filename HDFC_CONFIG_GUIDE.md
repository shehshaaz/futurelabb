# HDFC Payment Gateway Configuration Guide

## 📝 How to Add HDFC Credentials to .env File

### Step 1: Open the .env file
Navigate to: `backend/.env`

### Step 2: Add these lines to your .env file

```env
# HDFC Payment Gateway Configuration
HDFC_API_KEY=your_actual_api_key_here
HDFC_MERCHANT_ID=your_actual_merchant_id
HDFC_CLIENT_ID=your_actual_client_id
HDFC_BASE_URL=https://smartgatewayuat.hdfcbank.com
HDFC_RESPONSE_KEY=your_actual_response_key
HDFC_ENABLE_LOGGING=true

# Frontend and Backend URLs (if not already present)
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

### Step 3: Replace the placeholder values

Replace these with your actual HDFC credentials:
- `your_actual_api_key_here` → Your HDFC API Key
- `your_actual_merchant_id` → Your HDFC Merchant ID
- `your_actual_client_id` → Your HDFC Client ID
- `your_actual_response_key` → Your HDFC Response Key

### Step 4: Restart the backend server

After saving the .env file:
1. Stop the backend server (Ctrl+C in the terminal)
2. Start it again: `npm run dev`

## 🔒 Current Default Values (for testing)

If you don't have HDFC credentials yet, the system will use these default test values:

```javascript
API_KEY: 'A9949FA93754229AB0640140B902BC'
MERCHANT_ID: 'SG2238'
CLIENT_ID: 'hdfcmaster'
BASE_URL: 'https://smartgatewayuat.hdfcbank.com'
RESPONSE_KEY: '776522EDCCB4734AAA9C0975FB2724'
```

These are configured in `backend/controllers/payment.js` as fallback values.

## 🌐 Environment URLs

### For Testing (UAT):
```
HDFC_BASE_URL=https://smartgatewayuat.hdfcbank.com
```

### For Production:
```
HDFC_BASE_URL=https://smartgateway.hdfcbank.com
```

## 📋 Complete .env File Example

Here's what your complete .env file should look like:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/futurelabs

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# HDFC Payment Gateway
HDFC_API_KEY=your_actual_api_key_here
HDFC_MERCHANT_ID=your_actual_merchant_id
HDFC_CLIENT_ID=your_actual_client_id
HDFC_BASE_URL=https://smartgatewayuat.hdfcbank.com
HDFC_RESPONSE_KEY=your_actual_response_key
HDFC_ENABLE_LOGGING=true

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Email Configuration (if using)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=noreply@futurelabs.com
FROM_NAME=FutureLabs

# SMS Configuration (if using)
SMS_API_KEY=your_sms_api_key
SMS_SENDER_ID=FTRLBS
```

## ✅ Verification

After adding the credentials and restarting the server, you can verify by:

1. Check backend logs on startup - you should see no errors
2. Test the payment flow by creating an order
3. Check if the HDFC payment page loads correctly

## 🔐 Security Notes

- ✅ The .env file is already in .gitignore (good!)
- ✅ Never commit .env files to Git
- ✅ Never share your API keys publicly
- ✅ Use different credentials for UAT and Production

## 📞 Need Help?

If you need to get HDFC credentials:
1. Contact HDFC Bank's merchant services
2. Request SmartGateway API credentials
3. They will provide you with:
   - Merchant ID
   - API Key
   - Response Key
   - Client ID
   - Access to UAT and Production environments

---

**Note**: The current default values in the code are test credentials. For actual transactions, you MUST use your own HDFC-provided credentials.

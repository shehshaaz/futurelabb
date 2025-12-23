#!/usr/bin/env node

/**
 * Project Validation Script
 * Checks for common errors and configuration issues
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 FutureLabs Project Validation\n');
console.log('='.repeat(50));

let errors = 0;
let warnings = 0;
let passed = 0;

// Test 1: Check if backend dependencies are installed
console.log('\n📦 Checking Backend Dependencies...');
try {
    const backendNodeModules = path.join(__dirname, 'backend', 'node_modules');
    if (fs.existsSync(backendNodeModules)) {
        console.log('✅ Backend dependencies installed');
        passed++;
    } else {
        console.log('❌ Backend dependencies NOT installed');
        console.log('   Run: cd backend && npm install');
        errors++;
    }
} catch (err) {
    console.log('❌ Error checking backend dependencies:', err.message);
    errors++;
}

// Test 2: Check if frontend dependencies are installed
console.log('\n📦 Checking Frontend Dependencies...');
try {
    const frontendNodeModules = path.join(__dirname, 'frontend', 'node_modules');
    if (fs.existsSync(frontendNodeModules)) {
        console.log('✅ Frontend dependencies installed');
        passed++;
    } else {
        console.log('❌ Frontend dependencies NOT installed');
        console.log('   Run: cd frontend && npm install');
        errors++;
    }
} catch (err) {
    console.log('❌ Error checking frontend dependencies:', err.message);
    errors++;
}

// Test 3: Check backend .env file
console.log('\n⚙️  Checking Backend Configuration...');
try {
    const envPath = path.join(__dirname, 'backend', '.env');
    if (fs.existsSync(envPath)) {
        console.log('✅ Backend .env file exists');
        passed++;

        // Read and check for critical variables
        const envContent = fs.readFileSync(envPath, 'utf8');
        const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
        let missingVars = [];

        requiredVars.forEach(varName => {
            if (!envContent.includes(varName)) {
                missingVars.push(varName);
            }
        });

        if (missingVars.length > 0) {
            console.log(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
            warnings++;
        } else {
            console.log('✅ All critical environment variables present');
            passed++;
        }
    } else {
        console.log('⚠️  Backend .env file NOT found');
        console.log('   Create one based on .env.example');
        warnings++;
    }
} catch (err) {
    console.log('❌ Error checking backend .env:', err.message);
    errors++;
}

// Test 4: Check frontend config
console.log('\n⚙️  Checking Frontend Configuration...');
try {
    const configPath = path.join(__dirname, 'frontend', 'src', 'utils', 'config.js');
    if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, 'utf8');

        // Check if USE_MOCK_DATA is false
        if (configContent.includes('USE_MOCK_DATA = false')) {
            console.log('✅ Mock data disabled (API mode enabled)');
            passed++;
        } else if (configContent.includes('USE_MOCK_DATA = true')) {
            console.log('⚠️  Mock data is ENABLED - API calls will not work');
            console.log('   Change USE_MOCK_DATA to false in frontend/src/utils/config.js');
            warnings++;
        }

        // Check baseUrl
        if (configContent.includes('localhost:5000')) {
            console.log('✅ Backend URL configured for local development');
            passed++;
        }
    } else {
        console.log('❌ Frontend config.js NOT found');
        errors++;
    }
} catch (err) {
    console.log('❌ Error checking frontend config:', err.message);
    errors++;
}

// Test 5: Check critical backend files
console.log('\n📄 Checking Backend Files...');
const backendFiles = [
    'backend/server.js',
    'backend/routes/auth.js',
    'backend/routes/tests.js',
    'backend/routes/cart.js',
    'backend/routes/orders.js',
    'backend/models/User.js',
    'backend/models/Test.js'
];

backendFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        passed++;
    } else {
        console.log(`❌ Missing: ${file}`);
        errors++;
    }
});

if (errors === 0) {
    console.log(`✅ All ${backendFiles.length} critical backend files present`);
}

// Test 6: Check critical frontend files
console.log('\n📄 Checking Frontend Files...');
const frontendFiles = [
    'frontend/src/App.js',
    'frontend/src/index.js',
    'frontend/src/pages/Home.jsx',
    'frontend/src/components/Header.jsx',
    'frontend/src/admin/AdminDashboard.jsx'
];

frontendFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        passed++;
    } else {
        console.log(`❌ Missing: ${file}`);
        errors++;
    }
});

if (errors === 0) {
    console.log(`✅ All ${frontendFiles.length} critical frontend files present`);
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 Validation Summary\n');
console.log(`✅ Passed:   ${passed}`);
console.log(`⚠️  Warnings: ${warnings}`);
console.log(`❌ Errors:   ${errors}`);

if (errors === 0 && warnings === 0) {
    console.log('\n🎉 All checks passed! Project is ready to run.');
    console.log('\nTo start the application:');
    console.log('1. Start MongoDB: net start MongoDB (Windows)');
    console.log('2. Start Backend: cd backend && npm run dev');
    console.log('3. Start Frontend: cd frontend && npm start');
} else if (errors === 0) {
    console.log('\n⚠️  Project has warnings but should work.');
    console.log('Please review the warnings above.');
} else {
    console.log('\n❌ Project has errors that need to be fixed.');
    console.log('Please fix the errors above before running.');
    process.exit(1);
}

console.log('\n' + '='.repeat(50) + '\n');

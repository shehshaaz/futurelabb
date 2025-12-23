// DEBUG SCRIPT - Run this in browser console to check cart issue

console.log('=== CART DEBUG INFO ===');
console.log('1. LocalStorage Values:');
console.log('   userId:', localStorage.getItem('userId'));
console.log('   userToken:', localStorage.getItem('userToken'));
console.log('   userName:', localStorage.getItem('userName'));
console.log('   userPhone:', localStorage.getItem('userPhone'));

console.log('\n2. Type Checks:');
console.log('   userId type:', typeof localStorage.getItem('userId'));
console.log('   userId value:', JSON.stringify(localStorage.getItem('userId')));

console.log('\n3. Is userId valid?');
const userId = localStorage.getItem('userId');
if (!userId) {
    console.log('   ❌ userId is null or undefined');
} else if (userId === 'undefined') {
    console.log('   ❌ userId is the string "undefined"');
} else if (userId === 'null') {
    console.log('   ❌ userId is the string "null"');
} else if (userId.startsWith('mock-user-id-')) {
    console.log('   ⚠️  userId is a mock ID:', userId);
} else if (userId.length === 24 && /^[0-9a-fA-F]{24}$/.test(userId)) {
    console.log('   ✅ userId looks like a valid MongoDB ObjectId:', userId);
} else {
    console.log('   ⚠️  userId has unexpected format:', userId);
}

console.log('\n4. Instructions:');
console.log('   - If userId is undefined/null/invalid, you need to login again');
console.log('   - Run: localStorage.clear() then refresh and login');
console.log('   - After login, run this script again to verify');

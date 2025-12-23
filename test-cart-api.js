const axios = require('axios');

async function testCartAdd() {
    try {
        console.log('Testing cart add endpoint...');
        const response = await axios.post('http://localhost:5000/api/v1/cart/add', {
            userId: 'test123',
            testId: 'test456'
        });
        console.log('Success:', response.data);
    } catch (error) {
        console.log('Error:', error.response ? error.response.data : error.message);
    }
}

testCartAdd();

try {
    require('./controllers/payment');
    console.log('Payment controller loaded successfully');
} catch (error) {
    console.error('Error loading payment controller:', error);
}

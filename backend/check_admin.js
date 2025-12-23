const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config({ path: './.env' });

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const admin = await User.findOne({ phone: '9876543210' });

        if (admin) {
            console.log('Admin user found:', admin.phone);
            // Reset password to be sure
            admin.password = '123456';
            await admin.save();
            console.log('Admin password reset to 123456');
        } else {
            console.log('Admin user not found. Creating...');
            await User.create({
                name: 'Admin User',
                email: 'admin@example.com',
                phone: '9876543210',
                password: '123456',
                role: 'admin',
                isVerified: true
            });
            console.log('Admin user created successfully.');
        }
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkAdmin();

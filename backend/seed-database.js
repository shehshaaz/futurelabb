const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load models
const Test = require('./models/Test');
const Category = require('./models/Category');
const Banner = require('./models/Banner');
const User = require('./models/User');
const Location = require('./models/Location');
const Package = require('./models/Package');
const Cart = require('./models/Cart');
const Order = require('./models/Order');
const CollectorFolder = require('./models/CollectorFolder');
const TimeSlot = require('./models/TimeSlot');

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/futurelabs');
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Read JSON files
const tests = JSON.parse(fs.readFileSync(path.join(__dirname, '_data', 'tests.json'), 'utf-8'));
const categories = JSON.parse(fs.readFileSync(path.join(__dirname, '_data', 'categories.json'), 'utf-8'));
const banners = JSON.parse(fs.readFileSync(path.join(__dirname, '_data', 'banners.json'), 'utf-8'));
const locations = JSON.parse(fs.readFileSync(path.join(__dirname, '_data', 'locations.json'), 'utf-8'));
const users = JSON.parse(fs.readFileSync(path.join(__dirname, '_data', 'users.json'), 'utf-8'));

// Import into DB
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Test.deleteMany();
    await Category.deleteMany();
    await Banner.deleteMany();
    await User.deleteMany();
    await Location.deleteMany();
    await Package.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();
    await CollectorFolder.deleteMany();
    await TimeSlot.deleteMany();

    console.log('✅ Existing data cleared');

    // Insert new data
    await Test.insertMany(tests);
    console.log('✅ Tests imported');

    await Category.insertMany(categories);
    console.log('✅ Categories imported');

    await Banner.insertMany(banners);
    console.log('✅ Banners imported');

    await Location.insertMany(locations);
    console.log('✅ Locations imported');

    await User.insertMany(users);
    console.log('✅ Users imported');

    console.log('✅ Data import completed successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error.message);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await connectDB();

    await Test.deleteMany();
    await Category.deleteMany();
    await Banner.deleteMany();
    await User.deleteMany();
    await Location.deleteMany();
    await Package.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();
    await CollectorFolder.deleteMany();
    await TimeSlot.deleteMany();

    console.log('✅ Data deleted successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error deleting data:', error.message);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Usage: node seed-database.js [-i (import) | -d (delete)]');
  process.exit(1);
}
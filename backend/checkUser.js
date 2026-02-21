const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        const email = 'ass@gmail.com';
        console.log(`Checking for user: ${email}`);

        const user = await User.findOne({ email });

        if (user) {
            console.log(`User found: ${user.email}`);
            console.log(`User ID: ${user._id}`);
            const isMatch = await user.matchPassword('123456');
            console.log(`Password '123456' match: ${isMatch}`);
        } else {
            console.log('User not found in database.');
        }

        
        const count = await User.countDocuments();
        console.log(`Total users in DB: ${count}`);

        process.exit();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

check();

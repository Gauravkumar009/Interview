const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const reset = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        const email = 'ass@gmail.com';

        const user = await User.findOne({ email });

        if (user) {
            console.log(`User found: ${user.email}`);
            user.password = '123456';
            await user.save();
            console.log('Password reset successfully to: 123456');
        } else {
            console.log('User not found in database.');
        }

        process.exit();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

reset();

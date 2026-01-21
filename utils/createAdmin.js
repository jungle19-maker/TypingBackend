const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config({ path: './.env' });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const email = 'admin@example.com';
        const password = 'admin123';

        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            console.log('Admin already exists. Updating role...');
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('Admin role ensured.');
        } else {
            console.log('Creating new Admin...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await User.create({
                username: 'Admin',
                email,
                password: hashedPassword,
                role: 'admin',
                subscription: {
                    status: 'active',
                    planName: 'premium' // Admins get premium features
                }
            });
            console.log('Admin User Created Successfully');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();

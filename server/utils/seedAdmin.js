require('dotenv').config();
const bcrypt = require('bcrypt');
const connectDB = require('../config/db');
const User = require('../models/User');
const mongoose = require('mongoose');

const seedAdmin = async () => {
  await connectDB();

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  console.log('User is:', User, typeof User.findOne);

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`Admin with email ${email} already exists. Skipping.`);
    await mongoose.connection.close();
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await User.create({
    email: email.toLowerCase(),
    password: hashedPassword,
    role: 'ADMIN',
  });

  console.log('Seed admin created:');
  console.log(`  email: ${admin.email}`);
  console.log(`  password: ${password}  (change this after first login)`);

  await mongoose.connection.close();
  process.exit(0);
};

seedAdmin();
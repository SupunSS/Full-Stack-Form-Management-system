const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
    },
    role: {
      type: String,
      enum: ['CUSTOMER', 'ADMIN'],
      required: true,
      default: 'CUSTOMER',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
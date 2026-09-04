const mongoose = require('mongoose');

const mobileNumberRegex = /^(?:\+94|0)?7\d{8}$/; // adjust to your target country's format if needed

const submissionSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      match: [mobileNumberRegex, 'Invalid mobile number format'],
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    feedback: {
      type: String,
      required: false,
      trim: true,
    },
    userCreated: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    userModified: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    dateModified: {
      type: Date,
      default: null,
    },
  },
  { timestamps: false } // we're tracking dateCreated/dateModified manually per spec
);

module.exports = mongoose.model('Submission', submissionSchema);
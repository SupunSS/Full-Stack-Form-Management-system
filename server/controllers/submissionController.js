const Submission = require('../models/Submission');

// POST /api/submissions  (customer only)
const createSubmission = async (req, res) => {
  try {
    const { firstName, lastName, email, gender, mobileNumber, address, feedback } = req.body;

    // Basic required-field validation
    if (!firstName || !lastName || !email || !gender || !mobileNumber || !address) {
      return res.status(400).json({
        message: 'firstName, lastName, email, gender, mobileNumber, and address are required',
      });
    }

    if (!['MALE', 'FEMALE', 'OTHER'].includes(gender)) {
      return res.status(400).json({ message: 'gender must be MALE, FEMALE, or OTHER' });
    }

    const existing = await Submission.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'A submission with this email already exists' });
    }

    const submission = await Submission.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      gender,
      mobileNumber,
      address,
      feedback: feedback || '',
      userCreated: req.user.id, // set from the JWT, not the request body
      dateCreated: new Date(),
    });

    return res.status(201).json({ message: 'Submission created', submission });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: err.message });
    }
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/submissions  (admin only) — supports ?gender= and ?search=
const getAllSubmissions = async (req, res) => {
  try {
    const { gender, search } = req.query;
    const filter = {};

    if (gender) {
      if (!['MALE', 'FEMALE', 'OTHER'].includes(gender)) {
        return res.status(400).json({ message: 'gender must be MALE, FEMALE, or OTHER' });
      }
      filter.gender = gender;
    }

    if (search) {
      const regex = new RegExp(search, 'i'); // case-insensitive partial match
      filter.$or = [{ firstName: regex }, { lastName: regex }];
    }

    const submissions = await Submission.find(filter)
      .populate('userCreated', 'email')
      .populate('userModified', 'email')
      .sort({ dateCreated: -1 });

    return res.status(200).json({ count: submissions.length, submissions });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/submissions/:id  (admin only)
const updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Prevent overwriting audit fields directly from the request body
    delete updates.userCreated;
    delete updates.dateCreated;

    if (updates.gender && !['MALE', 'FEMALE', 'OTHER'].includes(updates.gender)) {
      return res.status(400).json({ message: 'gender must be MALE, FEMALE, or OTHER' });
    }

    updates.userModified = req.user.id;
    updates.dateModified = new Date();

    const submission = await Submission.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    return res.status(200).json({ message: 'Submission updated', submission });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: err.message });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid submission ID' });
    }
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/submissions/:id  (admin only)
const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findByIdAndDelete(id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    return res.status(200).json({ message: 'Submission deleted' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid submission ID' });
    }
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createSubmission, getAllSubmissions, updateSubmission, deleteSubmission };
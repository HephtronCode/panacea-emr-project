import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide a name'],
		trim: true
	},
	email: {
		type: String,
		required: [true, 'Please provide an email'],
		unique: true,
		lowercase: true,
		match: [
			/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
			'Please provide a valid email'
		]
	},
	password: {
		type: String,
		required: [true, 'Please provide a password'],
		minlength: 6,
		select: false
	},
	role: {
		type: String,
		enum: ['patient', 'doctor', 'nurse', 'admin', 'receptionist'],
		default: 'patient'
	},
}, {
	timestamps: true
});

// --- NEW SECURITY LAYER: AUTO-HASHING ---
// Run this before saving to DB
userSchema.pre('save', async function (next) {
	// If password wasn't modified (e.g. updating name only), skip hashing
	if (!this.isModified('password')) {
		next();
	}

	// Generate Salt & Hash
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// Method to generate JWT
userSchema.methods.generateAuthToken = function() {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE || '30d' // Fallback if env missing
	});
};

// Method to check password match
userSchema.methods.matchPassword = async function(enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
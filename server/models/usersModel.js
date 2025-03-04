const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
	{
		email: {
			type: String,
			required: [true, 'Email is required.'],
			trim: true,
			unique: [true, 'Email must be unique.'],
			minLength: [5, 'Email must have 5 characters.'],
			lowercase: true,
		},
		password: {
			type: String,
			required: [true, 'Password must be provided.'],
			trim: true,
			select: false,
		},
        phone: {
            type: Number,
            required: [true, 'Phone number must be provided.'],
            select: false
        },
        companyName: {
            type: String,
			required: [true, 'Company must be provided.'],
			trim: true
        },
        fullName: {
            type: String,
			required: [true, 'Full name must be provided.'],
			trim: true
        },
		username: {
            type: String,
			required: [true, 'Username name must be provided.'],
			trim: true
        },
        nik: {
            type: Number,
            required: [true, 'NIK number must be provided.'],
            select: false
        },
		idCardImage: {
			type: String,
			required: [true, 'Photo must be taken.'],
            select: false
		},
		selfieIdCardImage: {
			type: String,
			required: [true, 'Photo must be taken.'],
            select: false
		},
		verified: {
			type: Boolean,
			default: false,
		},
		verificationCode: {
			type: String,
			select: false,
		},
		verificationCodeValidation: {
			type: Number,
			select: false,
		},
		forgotPasswordCode: {
			type: String,
			select: false,
		},
		forgotPasswordCodeValidation: {
			type: Number,
			select: false,
		},
		role: { 
			type: String, 
			default: 'Admin', 
			enum: ['User', 'Admin', 'New', 'Manager', 'Regional', 'Vendor'] 
		},

	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('User', userSchema);

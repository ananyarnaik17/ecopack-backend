// backend/models/Submission.js

const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    productType: {
        type: [String],
        required: true,
    },
    dimensions: {
        length: {
            type: Number,
            required: true,
        },
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
    },
    weight: {
        type: Number,
        required: true,
    },
    durability: {
        type: [String],
        required: true,
    },
    shippingMethod: {
        type: [String],
        required: true,
    },
    additionalRequirements: {
        type: String,
    },
    recommendedPackage: {
        type: String,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    }
});

// Explicitly specifying the collection name: 'form_submissions'
module.exports = mongoose.model('Submission', SubmissionSchema, 'form_submissions');

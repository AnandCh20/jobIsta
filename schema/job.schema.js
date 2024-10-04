const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    logoUrl: {
        type: String,
        required: true,
    },
    jobPosition: {
        type: String,
        required: true,
    },
    monthlySalary: {
        type: Number,
        required: true,
    },
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Freelance'],
        default: 'Full-time'
    },
    remote: {
        type: Boolean,
        required: true,
    },
    location: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,

    },
    about: {
        type: String,
        required: false,
    },
    skills: {
        type: Array,
        required: false,
    },
    information: {
        type: String,
        required: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Job', jobSchema);
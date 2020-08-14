const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eduactions: [{
        start_date: {
            type: Date,
            required: true
        },
        end_date: {
            type: Date
        },
        end_date_present: {
            type: Boolean
        },
        school_name: {
            type: String,
            required: true
        },
        study: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
    }],
    experiences: [{
        start_date: {
            type: Date,
            required: true
        },
        end_date: {
            type: Date
        },
        end_date_present: {
            type: Boolean
        },
        company_name: {
            type: String,
            required: true
        },
        function: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
    }],
});

module.exports = mongoose.model('Cv', userSchema);
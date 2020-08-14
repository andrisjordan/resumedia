const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    phoneNumber: {
        type: String,
        match: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
        set: v => {
            if(v){
                v.replace("undefined", "")
                return v
            } else {
                return v
            }
        },
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["M", "F"]
    },
    language: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    educations: [{
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

module.exports = mongoose.model('User', userSchema);
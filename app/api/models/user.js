const mongoose = require('mongoose');

const userSchema = new accountSchema({
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
        }
    },
    gender: {
        type: String,
        required: false,
        enum: ["M", "F"]
    },
    language: {
        type: String,
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
});

module.exports = mongoose.model('User', userSchema);
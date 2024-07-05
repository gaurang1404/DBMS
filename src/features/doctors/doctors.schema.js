//! ADD DEPARTMENTS

import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    firstName: {
        type: String, 
        required: true, 
        trim: true,
        maxLength: [30, "First name cannot contain more than 30 characters"],
    },
    middleName: {
        type: String, 
        trim: true,
        maxLength: [30, "Middle name cannot contain more than 30 characters"],
    },
    lastName: {
        type: String, 
        required: true, 
        trim: true,
        maxLength: [30, "Last name cannot contain more than 30 characters"],
    },
    email: {
        type: String, 
        required: true, 
        unique: true, 
        trim: true,
        lowercase: true,
        match: [/.+\@.+\../, "Please enter a valid email ID"],
    },
    password: {
        type: String, 
        required: true,
        validate: {
            validator: function (value) {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value);
            },
            message: "Password should be between 8-12 characters and have a special character",
        },
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    contactNumber: {
        type: String, 
        required: true, 
        trim: true,
        match: /^\d{10}$/,
    },

})

export default doctorSchema;
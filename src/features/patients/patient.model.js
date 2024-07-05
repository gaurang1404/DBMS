import ValidationError from "../../error-handler/validationError.js";

export default class PatientModel {
    constructor(firstName, middleName, lastName, email, password, dateOfBirth, gender, contactNumber, address) {
        try {
            this.validate(firstName, middleName, lastName, email, password, dateOfBirth, gender, contactNumber, address);
        } catch (err) {
            throw new ValidationError(err);
        }
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.contactNumber = contactNumber;
        this.address = address;
    }

    validate(firstName, middleName, lastName, email, password, dateOfBirth, gender, contactNumber, address) {
        const errors = [];

        if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
            errors.push("First name is required");
        } else if (firstName.trim().length > 30) {
            errors.push("First name cannot contain more than 30 characters");
        }

        if (middleName && (typeof middleName !== 'string' || middleName.trim().length > 30)) {
            errors.push("Middle name cannot contain more than 30 characters");
        }

        if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
            errors.push("Last name is required");
        } else if (lastName.trim().length > 30) {
            errors.push("Last name cannot contain more than 30 characters");
        }

        const emailPattern = /.+\@.+\../;
        if (!email || typeof email !== 'string' || email.trim().length === 0) {
            errors.push("Email is required");
        } else if (!emailPattern.test(email.trim().toLowerCase())) {
            errors.push("Please enter a valid email ID");
        }

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
        if (!password || typeof password !== 'string' || password.length === 0) {
            errors.push("Password is required");
        } else if (!passwordPattern.test(password)) {
            errors.push("Password should be between 8-12 characters and have a special character");
        }

        const maxDateOfBirth = new Date();
        maxDateOfBirth.setFullYear(maxDateOfBirth.getFullYear() - 150);
        const dob = new Date(dateOfBirth);
        if (!dateOfBirth || dob > new Date() || dob < maxDateOfBirth) {
            errors.push('Date of birth cannot be more than 150 years ago or in the future.');
        }

        const validGenders = ['Male', 'Female', 'Other'];
        if (!gender || !validGenders.includes(gender)) {
            errors.push("Gender must be 'Male', 'Female', or 'Other'");
        }

        const contactNumberPattern = /^\d{10}$/;
        if (!contactNumber || typeof contactNumber !== 'string' || contactNumber.trim().length === 0) {
            errors.push("Contact number is required");
        } else if (!contactNumberPattern.test(contactNumber.trim())) {
            errors.push("Contact number must be a 10-digit number");
        }

        if (!address || typeof address !== 'string' || address.trim().length === 0) {
            errors.push("Address is required");
        }

        if (errors.length > 0) {
            throw errors;
        }
    }
}
import ValidationError from "../../error-handler/validationError.js";

export default class PatientModel {
    constructor(firstName, lastName, dob, gender, phone, email, password, address, medicalHistory) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.gender = gender;
        this.phone = phone;
        this.email = email;
        this.password = password;
        this.address = address;
        this.medicalHistory = medicalHistory;
    }
}
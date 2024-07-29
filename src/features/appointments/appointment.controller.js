import AppointmentRepository from "./appointment.repository.js";
import ValidationError from "../../error-handler/validationError.js";
import PatientController from "../patients/patient.controller.js";

const patientController = new PatientController();

export default class AppointmentController {

    constructor() {
        this.appointmentRepository = new AppointmentRepository();
    }

    async bookAppointment(req, res, next) {
        try {
            let obj = JSON.stringify(req.body); 
            obj = JSON.parse(obj);
            obj.patient_id = req.session.user.userId.toString();
            console.log(obj);
            await this.appointmentRepository.bookAppointment(obj);            
        } catch (err) {
            console.error("Error booking appointment:", err);
            next(err); // Pass the error to the next middleware
        }
        
        res.redirect("/patient/profile");
    }

    // async logIn(req, res) {
    //     try {
    //         const { email, password } = req.body;
    //         const user = await this.patientRepository.logIn(email, password);
    //         req.session.user = user;
    //         req.session.role = "patient";
    //         return res.render("index.ejs", {
    //             user: req.session.user,
    //         });
    //     } catch (err) {
    //         console.error("Error logging in:", err);
    //         res.status(500).send("Something went wrong, please try again later");
    //     }
    // }
}

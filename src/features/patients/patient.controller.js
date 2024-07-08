import PatientRepository from "./patient.repository.js";
import ValidationError from "../../error-handler/validationError.js";
import AppointmentRepository from "../appointments/appointment.repository.js";

const appointmentRepository = new AppointmentRepository();

export default class PatientController{

    constructor(){
        this.patientRepository = new PatientRepository();
    }

    getLogin(req, res){
        res.render('patientLogin.ejs', {errorMessage: null});
    }

    getSignup(req, res){
        res.render('patientAppForm.ejs');
    }

    getProfile(req, res){
        return res.render("patientProfile.ejs", {
            user: req.session.user,
            appointments: req.session.appointments        
        });
    }

    async signUp(req, res, next){
        try{
            const {firstName, lastName, dob, gender, phone, email, password, address, medicalHistory} = req.body;
            
            const user = {
                firstName,
                lastName,
                dob,
                gender,
                phone,
                email,
                password,
                address,
                medicalHistory
            }
     
            await this.patientRepository.signUp(user);
            return res.render('PatientLogin.ejs', {errorMessage: null});

        }catch(err){
            if(err instanceof ValidationError){
                return res.status(err.code).send(err.array);
            }
            console.log(err);
            return res.status(500).send("Something went wrong");
        }        
    }

    async logIn(req, res){
        try{
            const {email, password} = req.body;
            const user = await this.patientRepository.logIn(email, password);  
            console.log(user); 
            const appointments = await appointmentRepository.getPatientAppointments(user.userId);         
            req.session.user = user;
            req.session.appointments = appointments;
            req.session.role = "patient";
            return res.render("index.ejs", {
              user: req.session.user,
              doctors: req.session.doctors
            });
        }catch(err){
            console.log(err);
            res.status(500).send("Something went wrong, please try again later");
        }
    }
}
import PatientRepository from "./patient.repository.js";
import PatientModel from "./patient.model.js";
import ValidationError from "../../error-handler/validationError.js";

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
     
            const returnUser = await this.patientRepository.signUp(user);
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
            req.session.user = user;
            req.session.role = "patient";
            return res.render("index.ejs", {
              user: req.session.user,
            });
        }catch(err){
            res.status(500).send("Something went wrong, please try again later");
        }
    }
}
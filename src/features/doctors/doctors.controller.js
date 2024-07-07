import DoctorRepository from "./doctors.repository.js";
import ValidationError from "../../error-handler/validationError.js";

export default class DoctorController{

    constructor(){
        this.doctorRepository = new DoctorRepository();
    }

    getLogin(req, res){
        res.render('doctorLogin.ejs', {errorMessage: null});
    }

    getSignup(req, res){
        res.render('doctorRegistrationForm.ejs', {errorMessage: null});
    }

    getProfile(req, res){
        res.render('doctorProfile.ejs', {
            user: req.session.user,
            appointments: req.session.appointments
        });
    }

    async signUp(req, res, next){
        try{
            const {firstName, lastName, email, password, department, availableFrom, availableTo, experience} = req.body;
            
            const user = {
                firstName,
                lastName,
                email,
                password,
                department, 
                availableFrom,
                availableTo, 
                experience
            }
     
            await this.doctorRepository.signUp(user);
            return res.render('doctorLogin.ejs', {errorMessage: null});

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
            const user = await this.doctorRepository.logIn(email, password);            
            req.session.user = user;
            req.session.role = "doctor";
            return res.render("index.ejs", {
              user: req.session.user,
            });
        }catch(err){
            res.status(500).send("Something went wrong, please try again later");
        }
    }
}
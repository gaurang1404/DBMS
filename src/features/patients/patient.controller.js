import PatientRepository from "./patient.repository.js";
import PatientModel from "./patient.model.js";
import ValidationError from "../../error-handler/validationError.js";

export default class PatientController{

    constructor(){
        this.patientRepository = new PatientRepository();
    }

    async signUp(req, res, next){
        try{
            const {firstName, middleName, lastName, email, password, dateOfBirth, gender, contactNumber, address} = req.body;
            const user = new PatientModel(firstName, middleName, lastName, email, password, dateOfBirth, gender, contactNumber, address);
            const returnUser = await this.patientRepository.signUp(user);
            return res.status(201).send(returnUser);
        }catch(err){
            if(err instanceof ValidationError){
                return res.status(err.code).send(err.array);
            }
            if(err instanceof mongoose.Error.ValidationError){
                return res.status(500).send(err.message);
            }
            next(err);
        }        
    }

    async logIn(req, res){
        try{
            const {email, password} = req.body;
            const user = await this.patientRepository.logIn(email, password);
            if(!user){
                return res.status(401).send("Incorrect credentials, please check your email and password");
            }
            req.session.user = user;
            return res.status(200).send(user);
        }catch(err){
            if(err instanceof mongoose.Error.ValidationError){
                next(err);
            }
            res.status(500).send("Something went wrong, please try again later");
        }
    }

}
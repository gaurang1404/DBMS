import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

import ApplicationError from "../../error-handler/applicationError.js";
import ValidationError from "../../error-handler/validationError.js";
import DoctorModel from "./doctors.model.js";
import DoctorRepository from "./doctors.repository.js";

export default class DoctorController{
    constructor(){
        this.doctorRepository = new DoctorRepository();
    }

    async signUp(req, res, next){
        try{
            const {firstName, middleName, lastName, email, password, gender, contactNumber} = req.body;
            const user = new DoctorModel(firstName, middleName, lastName, email, password, gender, contactNumber);
            const newUser = await this.doctorRepository.signUp(user);
            res.status(201).send(newUser);
        }catch(err){
            next(err);
        }
    }

    async logIn(req, res, next){
        try{
            const {email, password} = req.body;
            const user = await this.doctorRepository.logIn(email, password);
            if(!user){
                return res.status(401).send("Incorrect credentials, please check your email and password");
            }

            const token = jwt.sign(
                {
                    userID: user._id,
                    email: user.email   
                }, 
                process.env.JWT_SECRET,
                {
                    expiresIn: '2h'
                }              
            )

            return res.status(200).send(token);
        }catch(err){
            next(err);
        }
    }

}
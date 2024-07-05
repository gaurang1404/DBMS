import mongoose from "mongoose";
import patientSchema from "./patients.schema.js";
import ApplicationError from '../../error-handler/applicationError.js'

const UserModel = mongoose.model('Patients', patientSchema);

export default class PatientRepository{

    async signUp(user){
        try{
            const existingUser = await UserModel.findOne({email: user.email});
            if(existingUser){
                throw new ApplicationError(400, "User with this email already exists"); 
            }
            const newUser = UserModel(user);
            await newUser.save();
            return user;
        }catch(err){
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }
            if(err instanceof ApplicationError){
                throw err;
            }  
            throw new ApplicationError(500, "Something went wrong with database, try again later");
        }
    }

    async logIn(email, password){
        try{
            return await UserModel.findOne({email, password});
        }catch(err){
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }
            console.log(err);
            throw new ApplicationError(500, "Something went wrong with the database");   
        }
    }

    async findByEmail(email){
        try{
            return await UserModel.findOne({email});
        }catch(err){
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }
            console.log(err);
            throw new ApplicationError(500, "Something went wrong with the database");   
        }
    }

}
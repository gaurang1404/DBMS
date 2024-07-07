import express from 'express';

import DoctorController from './doctors.controller.js';

const doctorRouter = express.Router();
const doctorController = new DoctorController();

doctorRouter.get('/signup', (req, res, next)=>{
    doctorController.getSignup(req, res, next);
})

doctorRouter.get('/login', (req, res, next)=>{
    doctorController.getLogin(req, res, next);
})

doctorRouter.get('/profile', (req, res, next)=>{
    doctorController.getProfile(req, res, next);
})

doctorRouter.post('/signup', (req, res, next)=>{
    doctorController.signUp(req, res, next);
})

doctorRouter.post('/login', (req, res, next)=>{
    doctorController.logIn(req, res, next);
})

export default doctorRouter;

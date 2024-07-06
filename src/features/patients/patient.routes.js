import express from "express"

import PatientController from "./patient.controller.js"

const patientRouter = express.Router();
const patientController = new PatientController();

patientRouter.get('/login', (req, res) => {
    patientController.getLogin(req, res);
})

patientRouter.get('/signup', (req, res) => {
    patientController.getSignup(req, res);
})

patientRouter.post('/signup', (req, res, next) => {
    patientController.signUp(req, res, next);
})

patientRouter.post('/login', (req, res) => {
    patientController.logIn(req, res);
})

export default patientRouter;
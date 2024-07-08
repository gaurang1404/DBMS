import express from "express"

import AppointmentController from "./appointment.controller.js";

const appointmentRouter = express.Router();
const appointmentController = new AppointmentController();

appointmentRouter.post('/', (req, res, next) => {
    appointmentController.bookAppointment(req, res, next);
})


export default appointmentRouter;
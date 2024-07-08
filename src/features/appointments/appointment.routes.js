import express from "express"

import AppointmentController from "./appointment.controller.js";

const appointmentRouter = express.Router();
const appointmentController = new AppointmentController();

appointmentRouter.post('/', (req, res) => {
    appointmentController.bookAppointment(req, res);
})


export default appointmentRouter;
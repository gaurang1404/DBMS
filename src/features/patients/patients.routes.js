import express from 'express';

const patientRouter = express.Router();

patientRouter.get('/', productController.getAllPatients);
patientRouter.get('/:id', productController.getPatientById);
patientRouter.get('/filter', productController.filterPatients);

export default patientRouter;
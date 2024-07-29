import mysql from 'mysql2';
import ApplicationError from '../../error-handler/applicationError.js'

export default class PatientRecords{
    constructor(){
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '2414',
            database: 'hospital',
            port: '3307'
        });
          
          // Connect to the database
          connection.connect((err) => {
            if (err) {
              console.error('Error connecting to the database:', err.stack);
              return;
            }
            console.log('Connected to the database as id ' + connection.threadId);
          });
          this.connection = connection;
    }


    async getRecords(appointment_id){
        try {
            
            const query = `SELECT * FROM medicalrecords WHERE appointment_id = ?` ;    
            // Start a transaction

            await new Promise((resolve, reject) => {
                this.connection.beginTransaction(err => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
    
            // Insert into users table
            const records = await new Promise((resolve, reject) => {
                this.connection.query(query, [appointment_id], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });
    
            // Commit the transaction
            await new Promise((resolve, reject) => {
                this.connection.commit(err => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });

            return records;
        } catch (err) {
            // Rollback the transaction in case of error
            await new Promise((resolve, reject) => {
                this.connection.rollback(() => {
                    reject(err);
                });
            });
            if (err instanceof ApplicationError) {
                throw err;
            }
            throw new ApplicationError(500, "Something went wrong with database, try again later");
        } 
    }

    async getDoctorRecords(doctor_id){
        try {
            
            const query = `SELECT * FROM medicalrecords WHERE doctor_id = ?` ;    
            // Start a transaction

            await new Promise((resolve, reject) => {
                this.connection.beginTransaction(err => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
    
            // Insert into users table
            const records = await new Promise((resolve, reject) => {
                this.connection.query(query, [doctor_id], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });
    
            // Commit the transaction
            await new Promise((resolve, reject) => {
                this.connection.commit(err => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
            return records;
        } catch (err) {
            // Rollback the transaction in case of error
            await new Promise((resolve, reject) => {
                this.connection.rollback(() => {
                    reject(err);
                });
            });
            if (err instanceof ApplicationError) {
                throw err;
            }
            throw new ApplicationError(500, "Something went wrong with database, try again later");
        } 
        
    }
}
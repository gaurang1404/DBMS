import mysql from 'mysql2';
import ApplicationError from '../../error-handler/applicationError.js'

export default class AppointmentRepository{
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

    async getPatientAppointments(id) {
        try {            
            const query = `SELECT 
    a.appointment_id,
    a.patient_id,
    a.doctor_id,
    a.appointment_date,
    a.appointment_time,
    a.status,
    u.first_name AS doctor_first_name,
    u.last_name AS doctor_last_name,
    d.department
FROM 
    appointments a
JOIN 
    doctors d ON a.doctor_id = d.doctor_id
JOIN 
    users u ON d.doctor_id = u.user_id
WHERE 
    a.patient_id = ?
`;  

            // Insert into users table
            const appointments = await new Promise((resolve, reject) => {
                this.connection.query(query, [id], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });      
            appointments.forEach(a => {
                let dateTimeString = a.appointment_date;
                let date = new Date(dateTimeString);
                let formattedDate = date.toISOString().substring(0, 10);
                a.appointment_date = formattedDate;
            })
            return appointments;
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

    async bookAppointment(obj){
        const query1 = `SELECT available_from FROM doctors WHERE doctor_id = ?`;
            const timing = await new Promise((resolve, reject) => {
                this.connection.query(query1, [obj.doctor_id], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });
            console.log(timing);

            const query2 = `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)`;
            await new Promise((resolve, reject) => {
                this.connection.query(query2, [obj.patient_id, obj.doctor_id, obj.date, timing[0].available_from, 'Scheduled'], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });
            
        }catch(err){
            console.log(err);
            return res.status(500).send("Something went wrong");
        }        
    }

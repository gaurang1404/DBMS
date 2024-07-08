import mysql from 'mysql2';
import ApplicationError from '../../error-handler/applicationError.js'

export default class PatientRepository{
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

    async signUp(user) {
        try {
            
            const query1 = `INSERT INTO users (password, email, first_name, last_name, user_type) VALUES (?, ?, ?, ?, 'Patient')`;
            const query2 = `INSERT INTO patients (patient_id, dob, gender, address, phone_number, medical_history) VALUES (LAST_INSERT_ID(), ?, ?, ?, ?, ?)`;
    
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
            await new Promise((resolve, reject) => {
                this.connection.query(query1, [user.password, user.email, user.firstName, user.lastName], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });
    
            // Insert into patients table
            await new Promise((resolve, reject) => {
                this.connection.query(query2, [user.dob, user.gender, user.address, user.phone, user.medicalHistory], (err, results) => {
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
        return user;
    }
    
    

    async logIn(email, password) {
        try {
            const query1 = `SELECT * FROM users WHERE email = ? AND password = ?`;
            const query2 = `SELECT * FROM patients WHERE patient_id = ?`;
            const results1 = await new Promise((resolve, reject) => {
                this.connection.query(query1, [email, password], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });

            if (results1.length === 0) {
                throw new ApplicationError(401, "Invalid email or password");
            }
    
            const results2 = await new Promise((resolve, reject) => {
                this.connection.query(query2, [results1[0].user_id], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });

            const user = {
                userId: results1[0].user_id,
                firstName: results1[0].first_name,
                lastName: results1[0].last_name,
                dob: results2[0].dob,
                gender: results2[0].gender,
                phone: results2[0].phone_number,
                email: results1[0].email,
                password: results1[0].password,
                address: results2[0].address,
                medicalHistory: results2[0].medical_history
            }
            console.log(user);
            return user;
        } catch (err) {
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
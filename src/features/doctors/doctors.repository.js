import mysql from 'mysql2';
import ApplicationError from '../../error-handler/applicationError.js'

export default class DoctorRepository{
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
            
            const query1 = `INSERT INTO users (password, email, first_name, last_name, user_type) VALUES (?, ?, ?, ?, 'Doctor')`;
            const query2 = `INSERT INTO doctors (doctor_id, years_of_experience, available_from, available_to, department) VALUES (LAST_INSERT_ID(), ?, ?, ?, ?)`;
    
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
                this.connection.query(query2, [user.experience, user.availableFrom, user.availableTo, user.department], (err, results) => {
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
            const query2 = `SELECT * FROM doctors WHERE doctor_id = ?`;
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

            // console.log(results1[0]);
            // console.log(results2[0]);

            const user = {
                userId: results1[0].user_id,
                firstName: results1[0].first_name,
                lastName: results1[0].last_name,
                email: results1[0].email,
                password: results1[0].password,
                department: results2[0].department,
                availableFrom: results2[0].available_from,
                availableTo: results2[0].available_to,
                experience: results2[0].years_of_experience
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
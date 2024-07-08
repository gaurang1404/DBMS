import mysql from 'mysql2';
import express from 'express';
import session from 'express-session';
import path from 'path';
import ejs from 'ejs';
import patientRouter from './src/features/patients/patient.routes.js';
import doctorRouter from './src/features/doctors/doctors.routes.js';
import appointmentRouter from './src/features/appointments/appointment.routes.js';

import ApplicationError from './src/error-handler/applicationError.js';

const server = express();

// Middleware to parse application/x-www-form-urlencoded
server.use(express.urlencoded({ extended: true }));

// Middleware to parse application/json
server.use(express.json());

server.use(
  session({
    secret: "SecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

server.use(express.static("public"));
server.set("view engine", 'ejs');
server.set("views", path.join(path.resolve(), "src", "views"));

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

server.use('/patient', patientRouter);
server.use('/doctor', doctorRouter);
server.use('/appointment', appointmentRouter);

server.get('/', async (req, res) => {
  try {
    const query = `SELECT user_id, first_name FROM users WHERE user_type = 'Doctor'`;
    const doctors = await new Promise((resolve, reject) => {
      connection.query(query, [], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
    req.session.doctors = doctors;
    res.render('index.ejs', { user: req.session.user || null, doctors });
  } catch (err) {
    console.log(err);
    throw new ApplicationError(500, "Something went wrong with the database");
  }
});

// Error handling middleware
server.use((err, req, res, next) => {
  if (err instanceof ApplicationError) {
    res.status(err.status).send(err.message);
  } else {
    res.status(500).send('Internal Server Error');
  }
});

server.listen(3000, () => {
  console.log("Server is running");
});

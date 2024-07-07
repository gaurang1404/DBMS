import mysql from 'mysql2';
import express from 'express';
import session from 'express-session';
import path from 'path';
import ejs from 'ejs';
import patientRouter from './src/features/patients/patient.routes.js';
import doctorRouter from './src/features/doctors/doctors.routes.js';

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(
    session({
      secret: "SecretKey",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
);

server.use(express.static("public"));
server.set("view engine", ejs);
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

server.get('/', (req, res) => {
    res.render('index.ejs', {user: null});
})


server.listen(3000, () => {
    console.log("Server is running");
});

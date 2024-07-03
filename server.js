import express from 'express';
import db from './src/connecrions/db.js';

const server = express();

server.get('/', (req, res) => {
    console.log("log");
    const sql = "SELECT * FROM patient";
    db.query(sql, (err, data) => {
        if(err){
            console.log(err);
            return res.json("Something went wrong");
        }else{
            console.log(data);
            return res.status(200).send(data);    
        }
    })
});

server.listen(3000, () => {
    console.log("Server is running");
});

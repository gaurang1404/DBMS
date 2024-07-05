import express from 'express';
import session from 'express-session';
import path from 'path';
import ejs from 'ejs';

import db from './src/connecrions/db.js';

const server = express();

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

server.use(express.json());

server.get('/', (req, res) => {
    res.render('index.ejs', {user: null});
})


server.listen(3000, () => {
    console.log("Server is running");
});

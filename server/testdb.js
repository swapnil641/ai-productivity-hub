const pool = require("./db");

pool.connect()
    .then(() => {
        console.log("Database Connected Successfully!");
    })
    .catch((err) => {
        console.log(err.message);
    });

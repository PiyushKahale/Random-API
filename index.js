const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const { log } = require("console");
const methodOverride = require("method-override");
const exp = require("constants");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

let port = 8080;
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "Newapp",
    password: "200$Piyush"
});

let RandomUser = () => {
    return [
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password()
    ];
};


app.listen(port, () => {
    console.log("Server is listening on port 8080");
});

// --- Home Page ---
app.get("/", (req, res) => {
    let q = `SELECT count(*) FROM user`;
    try{
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log(result[0]["count(*)"]);
            let cnt = result[0]["count(*)"];
            res.render("home.ejs", { cnt });
        }); 
    } catch (err) {
        console.log(err);
        res.send("Some error in database");
    }
});

// --- Getting user Info ---
app.get("/users", (req, res) => {
    let q = `SELECT * FROM user`;
    try{
        connection.query(q, (err, result) => {
            if (err) throw err;
            // res.send(result);
            res.render("users.ejs", { result });
        }); 
    } catch (err) {
        console.log(err);
        res.send("Some error in database");
    }
});


// --- Edit username ---
app.get("/users/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;

    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            res.render("edit.ejs",{ user });
        });
    } catch (err) {
        console.log(err);
        res.send("Some Error in DATABASE");
    }
});

// --- Update route ---
app.patch("/users/:id", (req, res) => {
    let { id } = req.params;
    let {password: formPass, username: newUsername} = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            if(formPass != user.password) {
                res.send("WRONG PASSWORD");
            }
            else {
                let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
                connection.query(q2, (err, result) => {
                    if(err) throw err;
                    res.redirect("/users");
                });
            }
            // res.render("edit.ejs", { user });
        });
    } catch (err) {
        console.log(err);
        res.send("Some Error in DATABASE");
    }
});

// let q = "INSERT INTO user(id, username, email, password) VALUES ?";



// Inserting New Data ----
// let data = [];
// for (let i = 1; i < 100; i++) {
//     data.push(RandomUser());
// }

// try {
//     connection.query(q, [data], (err, result) => {
//         if (err) throw err;
//         console.log(result);
//     }); 
// } catch (err) {
//     console.log(err);
// }

// connection.end();

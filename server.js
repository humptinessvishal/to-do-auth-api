const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");

//file-imports
const { registerFormAuth } = require("./utils/registerFormAuth");
const userModel = require("./models/userModel");

//constants
const app = express();
const PORT = process.env.PORT || 8000;

//middlewares
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//DB connect
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Mongodb connected successfully");
    })
    .catch((err) => {
        console.log(err);
    });

//apis
app.get("/", (req, res) => {
    console.log("GET / working");
    return res.send("Server App is running");
});

app.get("/register", (req, res) => {
    return res.render("register");
});

app.post("/register", async (req, res) => {
    const { name, email, username, password } = req.body;
    //data validation
    try {
        await registerFormAuth({ name, email, username, password });
    } catch (error) {
        return res.send({
            status: 400,
            message: "Data error",
            error: error,
        });
    };
    
    //email and usernames are unique
    //if it present in db then show error
    const userEmailsExist = await userModel.findOne({ email: email.toLowerCase() });
    if (userEmailsExist) {
        return res.send({
            status: 400,
            message: "Email already exist",
        });
    };

    const userUsernameExist = await userModel.findOne({ username: username.toLowerCase() });
    if (userUsernameExist) {
        return res.send({
            status: 400,
            message: "Username already exist",
        });
    };


    //store data in DB
    const userObj = new userModel({
        //schema key : value
        name: name,
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password: password,
    });

    try {
        const userDb = await userObj.save();
        return res.send({
            status: 201,
            message: "user created, registeration successfull!",
            data: userDb,
        });
    } catch (error) {
        return res.send({
            status: 500,
            message: "Data base error",
            error: error,
        });
    };
});

app.get("/login", (req, res) => {
    return res.send("login");
});

app.post("/login", (req, res) => {
    console.log(req.body);
    return res.send("Login success");
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
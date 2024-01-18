const validator = require("validator");

const passwordCheck = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    returnScore: false,
};

const registerFormAuth = ({ name, email, username, password }) => {
    console.log(name, email, username, password);
    return new Promise((resolve, reject) => {
        if (!name || !email || !username || !password) {
            reject("Missing credentials");
        };
        if (typeof name !== "string") {
            reject("Datatype of name is wrong");
        };
        if (typeof email !== "string") {
            reject("Datatype of email is wrong");
        };
        if (typeof username !== "string") {
            reject("Datatype of username is wrong");
        };
        if (typeof password !== "string") {
            reject("Datatype of password is wrong");
        };
        if (!validator.isLength(username, { min: 3, max: 20 })) {
            reject("username length should be 3-20");
        };
        if (!validator.isEmail(email)) {
            reject("Email format is wrong");
        };
        if (!validator.isStrongPassword(password, passwordCheck)) {
            reject("The password does not meet the strength criteria,Give minLength: 8, minLowercase: 1,minUppercase: 1,minNumbers: 1,minSymbols: 1,");
        };
        resolve();
    });
};

module.exports = { registerFormAuth };
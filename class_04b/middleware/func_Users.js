import mongoose from "mongoose";

// Import the secret key and the jsonwebtoken objects
import secret from "../config/configSecret.js";
import jsonwebtoken from 'jsonwebtoken';

// Creates the roles array
const ROLES = ["user", "admin", "customer"];

// Creates the database variable
const Users = mongoose.model('Users');

// Create the verifyToken function
export const verifyToken = (req, res, next) => {
    let token = req.session.token;
    if (!token) {
        const msgJson = {
            status_code: 403,
            status_message: "Forbidden",
            body_message: "The user does not have not access rights, please login first"
        };
        return res.status(403).send(msgJson);
    }

    jsonwebtoken.verify(token, secret, (err, decoded) => {
        if (err) {
            const msgJson = {
                status_code: 401,
                status_message: "Unauthorized",
                body_message: "The user is not authorized"
            };
            return res.status(401).send(msgJson);
        }
        req.UserID = decoded.id;
        next();
    });
};

export const verifyRol = (req, res, next) => {
    if (req.body.rol) {
        if (!ROLES.includes(req.body.rol)) {
            const msgJson = {
                status_code: 400,
                status_message: "Bad request",
                body_message: "The Rol not exists"
            };
            return res.status(400).send(msgJson);
        }
    }
    next();
};

// Create the verifyDuplicates (username & eMail) function
export const verifyDuplicates = async (req, res, next)  => {
    let msgJson = {};
    // Username validation
    await Users.findOne({username: req.body.username}).then(user =>{
        if (user) {
            msgJson = {
                status_code: 400,
                status_message: "Bad request",
                body_message: "Failed! The username is already in use!"
            };
        }
    }).catch(err => {
        msgJson = {
            status_code: 500,
            status_message: "Internal server error",
            body_message: err
        };
    });

    if (!msgJson.status_code) {
        // Email validation
        await Users.findOne({email: req.body.email}).then(user => {
            if (user) {
                const msgJson = {
                    status_code: 400,
                    status_message: "Bad request",
                    body_message: "Failed! The eMail is already in use!"
                };
            }
        }).catch(err => {
            const msgJson = {
                status_code: 500,
                status_message: "Internal server error",
                body_message: err
            };
        });
    }
    if (msgJson.status_code) {
        return res.status(msgJson.status_code).send(msgJson);
    }
    next();
};

export const isAdmin = async (req, res, next) => {
    let msgJson = {};
    await Users.findById(req.UserID).then(user => {
        if (user.rol === "admin") {
            console.log(user);
            next();
            return;
        }
        msgJson = {
            status_code: 403,
            status_message: "Forbidden",
            body_message: "The user does not have the necessary permissions"
        };
    }).catch(err => {
        msgJson = {
            status_code: 500,
            status_message: "Internal Server Error",
            body_message: err
        };
    });
    if (msgJson.status_code) {
        return res.status(msgJson.status_code).send(msgJson);
    }
};

export const isUser = async (req, res, next) => {
    let msgJson = {};
    await Users.findById(req.UserID).then(user => {
        if (user.rol === "user") {
            next();
            return;
        }
        msgJson = {
            status_code: 403,
            status_message: "Forbidden",
            body_message: "The current user does not have the minimum permissions"
        };
    }).catch(err => {
        msgJson = {
            status_code: 500,
            status_message: "Internal Server Error",
            body_message: err
        };
    });
    if (msgJson.status_code) {
        return res.status(msgJson.status_code).send(msgJson);
    }
};

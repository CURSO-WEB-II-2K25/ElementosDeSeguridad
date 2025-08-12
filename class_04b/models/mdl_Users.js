import mongoose from "mongoose";

const schUsers = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    rol: { type: String, required: true}
});

mongoose.model('Users', schUsers);

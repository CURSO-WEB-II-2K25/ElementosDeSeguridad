import mongoose from "mongoose";

const schRoles = new mongoose.Schema(
    {
        name: { type: String, required: true },
        level: { type: Number, required: true },
        description: { type: String, required: true }
    }
);

mongoose.model('Roles', schRoles);

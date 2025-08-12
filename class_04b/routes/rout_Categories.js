import express from "express";
import { getCategories, addCategories, updCategories, delCategories} from "../controllers/ctrl_Categories.js";
import { verifyToken, isAdmin, isUser } from "../middleware/func_Users.js";

const categories = express.Router();

categories.get("/", getCategories);
categories.post("/", [verifyToken, isUser], addCategories);
categories.put("/", [verifyToken, isAdmin], updCategories);
categories.delete("/", [verifyToken, isAdmin], delCategories);

export default categories ;

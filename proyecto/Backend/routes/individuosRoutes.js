import express from "express";
import { createIndividuo,getIndividuos } from "../controllers/individuosController.js";
import multer from "multer";

const router = express.Router();


const storage = multer.memoryStorage(); 
const upload = multer({ storage });


router.post("/", upload.single("imagen"), createIndividuo);


router.get("/", getIndividuos);

export default router;

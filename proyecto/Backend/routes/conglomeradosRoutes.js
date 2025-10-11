import express from "express";
import { getConglomerados } from "../controllers/conglomeradosController.js";
const router = express.Router();

router.get("/", getConglomerados);

export default router;

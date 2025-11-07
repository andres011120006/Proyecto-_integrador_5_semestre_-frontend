import express from "express";
import { IncidenciaController } from "../infrastructure/input_adapters/IncidenciaController.js";
import { MongoDBAdapter } from "../infrastructure/output_adapters/MongoDBAdapter.js";

const app = express();
app.use(express.json());

const adapter = new MongoDBAdapter();
const controller = new IncidenciaController(adapter);

app.post("/incidencias", (req, res) => controller.registrar(req, res));

export default app;

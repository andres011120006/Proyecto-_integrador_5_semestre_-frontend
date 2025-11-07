import { IncidenciaOutputPort } from "../../domain/interfaces/IncidenciaOutputPort.js";
import IncidenciaModel from "../database/mongoConfig.js";

export class MongoDBAdapter extends IncidenciaOutputPort {
  async guardarIncidencia(incidencia) {
    await IncidenciaModel.create(incidencia);
  }
}

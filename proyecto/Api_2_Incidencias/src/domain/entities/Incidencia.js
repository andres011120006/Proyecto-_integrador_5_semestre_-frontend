/**
 * @class Incidencia
 * @description Entidad de dominio que representa una incidencia dentro del sistema.
 * Esta clase aplica las reglas de negocio y validaciones necesarias antes de persistir los datos.
 */
export class Incidencia {
  /**
   * @constructor
   * @param {Object} props - Datos de la incidencia.
   * @param {string} props.nombre_conglomerado - Nombre del conglomerado asociado.
   * @param {string} props.categoria - Categoría de la incidencia ("menor" o "mayor").
   * @param {string} props.descripcion - Descripción detallada de la incidencia.
   */
  constructor({ nombre_conglomerado, categoria, descripcion }) {
    // Validación: todos los campos son obligatorios
    if (!nombre_conglomerado || !categoria || !descripcion) {
      throw new Error("Todos los campos son obligatorios");
    }

    // Validación: solo se aceptan categorías permitidas
    const categoriasValidas = ["menor", "mayor"];
    if (!categoriasValidas.includes(categoria.toLowerCase())) {
      throw new Error("Categoría inválida: debe ser 'menor' o 'mayor'");
    }

    // Asignación de propiedades con formato estándar
    this.nombre_conglomerado = nombre_conglomerado;
    this.categoria = categoria.toLowerCase();
    this.descripcion = descripcion;
    this.fecha_registro = new Date(); // Fecha actual por defecto
  }

  /**
   * @method toJSON
   * @description Convierte la entidad a un objeto plano listo para guardar o enviar.
   * @returns {Object} Representación serializable de la incidencia.
   */
  toJSON() {
    return {
      nombre_conglomerado: this.nombre_conglomerado,
      categoria: this.categoria,
      descripcion: this.descripcion,
      fecha_registro: this.fecha_registro,
    };
  }
}

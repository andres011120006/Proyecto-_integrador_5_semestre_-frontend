export class Incidencia {
  constructor({ nombre_conglomerado, categoria, descripcion }) {
    if (!nombre_conglomerado || !categoria || !descripcion) {
      throw new Error("Todos los campos son obligatorios");
    }

    // Validar  categoría
    const categoriasValidas = ["menor", "mayor"];
    if (!categoriasValidas.includes(categoria.toLowerCase())) {
      throw new Error("Categoría inválida: debe ser 'menor' o 'mayor'");
    }

    this.nombre_conglomerado = nombre_conglomerado;
    this.categoria = categoria.toLowerCase();
    this.descripcion = descripcion;
    this.fecha_registro = new Date();
  }
}

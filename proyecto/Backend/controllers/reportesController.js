import { supabase } from "../config/supabaseClient.js";

export const obtenerReporteConglomerado = async (req, res) => {
  try {
    const { id_conglomerado } = req.params;

    console.log(" Generando reporte simple para conglomerado:", id_conglomerado);

    if (!id_conglomerado) {
      return res.status(400).json({
        success: false,
        message: "El parámetro id_conglomerado es obligatorio"
      });
    }

    // 1. Obtener datos del conglomerado
    const { data: conglomerado, error: errorConglomerado } = await supabase
      .from("conglomerados")
      .select("*")
      .eq("id_conglomerado", id_conglomerado)
      .single();

    if (errorConglomerado || !conglomerado) {
      console.error(" Conglomerado no encontrado:", errorConglomerado);
      return res.status(404).json({
        success: false,
        message: "Conglomerado no encontrado"
      });
    }

    // 2. Obtener conteo de individuos
    const { count: totalIndividuos, error: errorIndividuos } = await supabase
      .from("individuo_arboreo")
      .select("*", { count: "exact", head: true })
      .eq("nombre_conglomerado", conglomerado.nombre);

    if (errorIndividuos) {
      console.error(" Error obteniendo individuos:", errorIndividuos);
    }

    // 3. Obtener conteo de muestras
    const { count: totalMuestras, error: errorMuestras } = await supabase
      .from("muestra")
      .select("*", { count: "exact", head: true })
      .eq("nombre_conglomerado", conglomerado.nombre);

    if (errorMuestras) {
      console.error(" Error obteniendo muestras:", errorMuestras);
    }

    // 4. Construir reporte simple
    const reporte = {
      id: conglomerado.id_conglomerado,
      nombre: conglomerado.nombre,
      ubicacion: {
        latitud: conglomerado.latitud,
        longitud: conglomerado.longitud
      },
      fecha_generado: new Date().toISOString(),
      resumen: {
        total_individuos: totalIndividuos || 0,
        total_muestras: totalMuestras || 0
      }
    };

    console.log(" Reporte generado correctamente");
    res.json({
      success: true,
      data: reporte
    });

  } catch (error) {
    console.error(" Error generando reporte:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

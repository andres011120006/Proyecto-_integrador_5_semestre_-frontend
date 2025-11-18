import { supabase } from "../config/supabaseClient.js";

/**
 * Obtener todos los conglomerados (ruta existente)
 */
export const getConglomerados = async (req, res) => {
  try {
    console.log(" Obteniendo todos los conglomerados");
    const { data, error } = await supabase.from("conglomerados").select("*");
    
    if (error) {
      console.error(" Error en getConglomerados:", error);
      return res.status(500).json({ error: error.message });
    }
    
    console.log(` ${data.length} conglomerados encontrados`);
    res.json(data);
    
  } catch (error) {
    console.error(" Error en getConglomerados:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * Obtener conglomerados paginados para el modal
 */
export const getConglomeradosPaginados = async (req, res) => {
  try {
    console.log(" Solicitud de conglomerados paginados:", req.query);
    
    const { page = 1, limit = 20, search = '' } = req.query;
    const offset = (page - 1) * limit;

    // Construir consulta base
    let query = supabase
      .from("conglomerados")
      .select("id_conglomerado, nombre, latitud, longitud", { count: 'exact' });

    // Aplicar búsqueda si existe
    if (search && search.trim() !== '') {
      query = query.ilike('nombre', `%${search.trim()}%`);
      console.log(` Búsqueda aplicada: "${search}"`);
    }

    // Aplicar paginación y ordenamiento
    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .order("nombre");

    if (error) {
      console.error(" Error en Supabase:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener conglomerados de la base de datos"
      });
    }

    console.log(` ${data.length} conglomerados encontrados (total: ${count})`);

    // Respuesta exitosa
    res.json({
      success: true,
      data: data || [],
      total: count || 0,
      page: parseInt(page),
      totalPages: Math.ceil((count || 0) / limit),
      hasMore: offset + data.length < (count || 0)
    });

  } catch (error) {
    console.error(" Error en getConglomeradosPaginados:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};
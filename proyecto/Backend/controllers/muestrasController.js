import { supabase } from "../config/supabaseClient.js";

export const createMuestra = async (req, res) => {
  try {
    console.log("📥 Datos recibidos en backend:", req.body);
    console.log("📁 Archivo recibido:", req.file ? req.file.originalname : "No hay archivo");

    const { 
      nombreConglomerado, 
      subparcela, 
      categoria, 
      latitud, 
      longitud,
      individuoSeleccionado 
    } = req.body;
    
    const imagen = req.file;

    // Validar campos obligatorios
    if (!nombreConglomerado || !categoria) {
      return res.status(400).json({ 
        error: "Los campos nombreConglomerado y categoria son obligatorios" 
      });
    }

    let imagenUrl = null;

    // Subir imagen si existe
    if (imagen) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("imagenes-muestra")
        .upload(`muestras/${Date.now()}_${imagen.originalname}`, imagen.buffer, {
          contentType: imagen.mimetype,
          upsert: false,
        });

      if (uploadError) {
        console.error("❌ Error subiendo imagen:", uploadError);
        throw uploadError;
      }

      const { data: publicUrl } = supabase.storage
        .from("imagenes-muestras")
        .getPublicUrl(uploadData.path);

      imagenUrl = publicUrl.publicUrl;
      console.log("✅ Imagen subida:", imagenUrl);
    }

    // Preparar datos para insertar
    const muestraData = {
      nombre_conglomerado: nombreConglomerado,
      subparcela: subparcela,
      tipo_muestra: categoria,
      latitud: latitud ? parseFloat(latitud) : null,
      longitud: longitud ? parseFloat(longitud) : null,
      imagen_url: imagenUrl,
      fecha_registro: new Date().toISOString()
    };

    // Si hay individuo seleccionado, guardarlo como JSON
    if (individuoSeleccionado) {
      try {
        muestraData.individuo_seleccionado = JSON.parse(individuoSeleccionado);
      } catch (e) {
        console.warn("⚠️ No se pudo parsear individuo_seleccionado:", e.message);
      }
    }

    console.log("💾 Insertando en BD:", muestraData);

    // Insertar en la base de datos
    const { data, error } = await supabase
      .from("muestra")
      .insert([muestraData])
      .select();

    if (error) {
      console.error("❌ Error insertando en Supabase:", error);
      throw error;
    }

    console.log("✅ Muestra guardada en BD:", data);

    res.status(201).json({
      success: true,
      message: "✅ Muestra registrada correctamente",
      data: data[0],
    });

  } catch (error) {
    console.error("❌ Error al registrar muestra:", error);
    res.status(500).json({ 
      success: false,
      error: "Error interno del servidor",
      details: error.message 
    });
  }
};
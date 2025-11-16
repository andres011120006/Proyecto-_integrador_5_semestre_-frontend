import { supabase } from "../config/supabaseClient.js";

export const createMuestra = async (req, res) => {
  try {
    console.log("📨 Datos recibidos en backend:", req.body);
    console.log("📸 Archivo recibido:", req.file ? req.file.originalname : "No hay archivo");

    const { 
      nombreConglomerado, 
      subparcela, 
      categoria, 
      idIndividuo
    } = req.body;
    
    const imagen = req.file;

    // Validar campos obligatorios
    if (!nombreConglomerado || !categoria || !idIndividuo) {
      return res.status(400).json({ 
        success: false,
        error: "Los campos nombreConglomerado, categoria e idIndividuo son obligatorios" 
      });
    }

    let imagenUrl = null;

    // Subir imagen si existe
    if (imagen) {
      try {
        const fileName = `muestras/${Date.now()}_${imagen.originalname}`;
        console.log("📤 Subiendo imagen:", fileName);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("imagenes-muestras")
          .upload(fileName, imagen.buffer, {
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
      } catch (imageError) {
        console.error("⚠️ Error al subir imagen, continuando sin imagen:", imageError);
      }
    }

    // Preparar datos para insertar
    const muestraData = {
      nombre_conglomerado: nombreConglomerado,
      subparcela: parseInt(subparcela) || 1,
      tipo_muestra: categoria,
      id_individuo: parseInt(idIndividuo),
      imagen_url: imagenUrl,
      fecha_registro: new Date().toISOString()
    };

    console.log("💾 Insertando en tabla 'muestra':", muestraData);

    // ✅ INSERTAR EN LA TABLA SINGULAR 'muestra'
    const { data, error } = await supabase
      .from("muestra") // ✅ Nombre singular
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
    console.error("💥 Error al registrar muestra:", error);
    res.status(500).json({ 
      success: false,
      error: "Error interno del servidor",
      details: error.message 
    });
  }
};
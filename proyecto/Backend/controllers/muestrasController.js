import { supabase } from "../config/supabaseClient.js";

export const createMuestra = async (req, res) => {
  try {
    const { idIndividuo, tipoMuestra } = req.body;
    const imagen = req.file;

    let imagenUrl = null;

    if (imagen) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("imagenes-muestras")
        .upload(`muestras/${Date.now()}_${imagen.originalname}`, imagen.buffer, {
          contentType: imagen.mimetype,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from("imagenes-muestras")
        .getPublicUrl(uploadData.path);

      imagenUrl = publicUrl.publicUrl;
    }

 
    const { data, error } = await supabase.from("muestra").insert([
      {
        id_individuo: idIndividuo,
        tipo_muestra: tipoMuestra,
        imagen_url: imagenUrl,
      },
    ]);

    if (error) throw error;

    res.status(201).json({
      message: "✅ Muestra registrada correctamente",
      data,
    });
  } catch (error) {
    console.error("Error al registrar muestra:", error);
    res.status(500).json({ error: error.message });
  }
};

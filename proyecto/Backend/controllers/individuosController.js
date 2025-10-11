import { supabase } from "../config/supabaseClient.js";

export const createIndividuo = async (req, res) => {
  try {
    const { nombreConglomerado, subparcela, categoria, latitud, longitud } = req.body;
    const imagen = req.file; // archivo de imagen

    let imagenUrl = null;

    // 🔹 Si se sube imagen, la guardamos en el bucket "imagenes-individuos"
    if (imagen) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("imagenes-individuos")
        .upload(`individuos/${Date.now()}_${imagen.originalname}`, imagen.buffer, {
          contentType: imagen.mimetype,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 🔹 Obtener URL pública
      const { data: publicUrl } = supabase.storage
        .from("imagenes-individuos")
        .getPublicUrl(uploadData.path);

      imagenUrl = publicUrl.publicUrl;
    }

    // 🔹 Insertar en tabla individuo_arboreo
    const { data, error } = await supabase.from("individuo_arboreo").insert([
      {
        nombre_conglomerado: nombreConglomerado,
        subparcela,
        categoria,
        latitud: parseFloat(latitud),
        longitud: parseFloat(longitud),
        imagen_url: imagenUrl,
      },
    ]);

    if (error) throw error;

    res.status(201).json({
      message: "✅ Individuo arbóreo registrado correctamente",
      data,
    });
  } catch (error) {
    console.error("Error al registrar individuo:", error);
    res.status(500).json({ error: error.message });
  }
};




// Traer individuos filtrados
export const getIndividuos = async (req, res) => {
  try {
    const { conglomerado, subparcela } = req.query;

    if (!conglomerado || !subparcela)
      return res.status(400).json({ error: "Faltan parámetros" });

    const { data, error } = await supabase
      .from("individuo_arboreo")
      .select("*")
      .eq("nombre_conglomerado", conglomerado)
      .eq("subparcela", subparcela);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("Error al traer individuos:", error);
    res.status(500).json({ error: error.message });
  }
};

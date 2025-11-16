import { supabase } from "../config/supabaseClient.js";

export const createIndividuo = async (req, res) => {
  try {
    const { nombreConglomerado, subparcela, dap, azimut, distancia, categoria } = req.body;
    const imagen = req.file;

    // Validaciones requeridas
    if (!nombreConglomerado || !subparcela || !dap || !azimut || !distancia || !categoria) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos: nombreConglomerado, subparcela, dap, azimut, distancia, categoria"
      });
    }

    let imagenUrl = null;

    // Procesar imagen si existe
    if (imagen) {
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("imagenes-individuos")
          .upload(`individuos/${Date.now()}_${imagen.originalname}`, imagen.buffer, {
            contentType: imagen.mimetype,
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("imagenes-individuos")
          .getPublicUrl(uploadData.path);

        imagenUrl = publicUrl.publicUrl;
      } catch (imageError) {
        console.error("Error al subir imagen:", imageError);
        // Continuar sin imagen si hay error
      }
    }

    // Preparar datos para insertar
    const individuoData = {
      nombre_conglomerado: nombreConglomerado,
      subparcela: parseInt(subparcela),
      dap: parseFloat(dap),
      azimut: parseFloat(azimut),
      distancia: parseFloat(distancia),
      categoria: categoria,
      imagen_url: imagenUrl
    };

    // Intentar insertar con fecha_registro, si falla intentar sin ella
    let data, error;
    
    try {
      // Intentar con fecha_registro
      const result = await supabase.from("individuo_arboreo")
        .insert([{ ...individuoData, fecha_registro: new Date().toISOString() }])
        .select();
      
      data = result.data;
      error = result.error;
    } catch (e) {
      // Si falla, intentar sin fecha_registro (la base de datos puede tener DEFAULT)
      console.log("Intentando insertar sin fecha_registro...");
      const result = await supabase.from("individuo_arboreo")
        .insert([individuoData])
        .select();
      
      data = result.data;
      error = result.error;
    }

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: " Individuo arbóreo registrado correctamente",
      data: data[0],
    });
  } catch (error) {
    console.error("Error al registrar individuo:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const createMultipleIndividuos = async (req, res) => {
  try {
    const individuos = req.body.individuos;
    
    if (!individuos || !Array.isArray(individuos) || individuos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Se requiere un array 'individuos' con al menos un elemento"
      });
    }

    const resultados = [];
    const errores = [];

    for (let i = 0; i < individuos.length; i++) {
      try {
        const individuo = individuos[i];
        const { nombreConglomerado, subparcela, dap, azimut, distancia, categoria } = individuo;

        if (!nombreConglomerado || !subparcela || !dap || !azimut || !distancia || !categoria) {
          errores.push({ indice: i, error: "Faltan campos requeridos" });
          continue;
        }

        let imagenUrl = null;
        const imagenFile = req.files?.find(file => file.fieldname === `imagen_${i}`);
        
        if (imagenFile) {
          try {
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from("imagenes-individuos")
              .upload(`individuos/${Date.now()}_${i}_${imagenFile.originalname}`, imagenFile.buffer, {
                contentType: imagenFile.mimetype,
                upsert: false,
              });

            if (uploadError) throw uploadError;

            const { data: publicUrl } = supabase.storage
              .from("imagenes-individuos")
              .getPublicUrl(uploadData.path);

            imagenUrl = publicUrl.publicUrl;
          } catch (imageError) {
            console.error(`Error al subir imagen del individuo ${i}:`, imageError);
          }
        }

        // Preparar datos
        const individuoData = {
          nombre_conglomerado: nombreConglomerado,
          subparcela: parseInt(subparcela),
          dap: parseFloat(dap),
          azimut: parseFloat(azimut),
          distancia: parseFloat(distancia),
          categoria: categoria,
          imagen_url: imagenUrl
        };

        // Intentar insertar
        let data, error;
        
        try {
          const result = await supabase.from("individuo_arboreo")
            .insert([{ ...individuoData, fecha_registro: new Date().toISOString() }])
            .select();
          data = result.data;
          error = result.error;
        } catch (e) {
          const result = await supabase.from("individuo_arboreo")
            .insert([individuoData])
            .select();
          data = result.data;
          error = result.error;
        }

        if (error) {
          errores.push({ indice: i, error: error.message });
        } else {
          resultados.push(data[0]);
        }

      } catch (error) {
        errores.push({ indice: i, error: error.message });
      }
    }

    res.status(201).json({
      success: true,
      message: `Procesados ${resultados.length} de ${individuos.length} individuos`,
      datos: {
        exitosos: resultados.length,
        fallidos: errores.length,
        individuos_registrados: resultados,
        errores: errores
      }
    });

  } catch (error) {
    console.error("Error al registrar múltiples individuos:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const getIndividuos = async (req, res) => {
  try {
    const { conglomerado, subparcela } = req.query;

    console.log("🔍 Búsqueda de individuos:", { conglomerado, subparcela });

    if (!conglomerado || !subparcela) {
      return res.status(400).json({ 
        success: false,
        error: "Se requieren los parámetros 'conglomerado' y 'subparcela'" 
      });
    }

    // ✅ CONSULTA SIMPLIFICADA - Solo campos esenciales
    const { data, error } = await supabase
      .from("individuo_arboreo")
      .select("id, nombre_conglomerado, subparcela, dap, azimut, distancia, categoria, imagen_url")
      .eq("nombre_conglomerado", conglomerado)
      .eq("subparcela", parseInt(subparcela))
      .order("id", { ascending: true });

    if (error) {
      console.error("❌ Error en consulta Supabase:", error);
      throw error;
    }

    console.log(`✅ ${data?.length || 0} individuos encontrados`);

    res.json({
      success: true,
      data: data || [],
      total: data?.length || 0
    });

  } catch (error) {
    console.error("💥 Error al obtener individuos:", error);
    res.status(500).json({ 
      success: false,
      error: "Error interno del servidor",
      details: error.message 
    });
  }
};
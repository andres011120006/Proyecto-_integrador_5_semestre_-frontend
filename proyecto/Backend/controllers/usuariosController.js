import { supabase } from "../config/supabaseClient.js";

export const loginUsuario = async (req, res) => {
  try {
    console.log(" Solicitud de login recibida:", req.body);
    
    const { usuario, contrasena } = req.body;

    // Validar que vengan los campos requeridos
    if (!usuario || !contrasena) {
      return res.status(400).json({
        success: false,
        message: "Usuario y contraseña son requeridos"
      });
    }

    console.log(`🔍 Buscando usuario: ${usuario}`);

    // Buscar el usuario en la base de datos con información del conglomerado
    const { data, error } = await supabase
      .from("brigadistas")
      .select(`
        id_brigadista, 
        usuario, 
        contraseña, 
        rol,
        conglomerado_id,
        conglomerados (id_conglomerado, nombre, latitud, longitud)
      `)
      .eq("usuario", usuario)
      .single();

    if (error) {
      console.error(" Error en consulta Supabase:", error);
      return res.status(401).json({
        success: false,
        message: "Error en la base de datos"
      });
    }

    if (!data) {
      console.log(" Usuario no encontrado en la base de datos");
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    console.log(" Usuario encontrado:", data.usuario);

    // Verificar la contraseña (en texto plano por ahora)
    if (data.contraseña !== contrasena) {
      console.log(" Contraseña incorrecta");
      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta"
      });
    }

    console.log(" Login exitoso para:", data.usuario);

    // Login exitoso
    res.json({
      success: true,
      id_brigadista: data.id_brigadista,
      usuario: data.usuario,
      rol: data.rol,
      conglomerado: data.conglomerados ? {
        id: data.conglomerados.id_conglomerado,
        nombre: data.conglomerados.nombre,
        latitud: data.conglomerados.latitud,
        longitud: data.conglomerados.longitud
      } : null,
      message: "Login exitoso"
    });

  } catch (error) {
    console.error(" Error en el login:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

/**
 * Controlador para actualizar el conglomerado del usuario
 */
export const actualizarConglomeradoUsuario = async (req, res) => {
  try {
    const { usuario, conglomerado_id } = req.body;

    console.log(` Actualizando conglomerado: usuario=${usuario}, conglomerado_id=${conglomerado_id}`);

    if (!usuario || !conglomerado_id) {
      return res.status(400).json({
        success: false,
        message: "Usuario y conglomerado_id son requeridos"
      });
    }

    // Actualizar el conglomerado del usuario
    const { data, error } = await supabase
      .from("brigadistas")
      .update({ conglomerado_id: parseInt(conglomerado_id) })
      .eq("usuario", usuario)
      .select(`
        id_brigadista, 
        usuario, 
        rol,
        conglomerado_id,
        conglomerados (id_conglomerado, nombre, latitud, longitud)
      `)
      .single();

    if (error) {
      console.error(" Error al actualizar conglomerado:", error);
      return res.status(500).json({
        success: false,
        message: "Error al actualizar conglomerado en la base de datos: " + error.message
      });
    }

    console.log(" Conglomerado actualizado correctamente");

    res.json({
      success: true,
      usuario: data.usuario,
      rol: data.rol,
      conglomerado: data.conglomerados ? {
        id: data.conglomerados.id_conglomerado,
        nombre: data.conglomerados.nombre,
        latitud: data.conglomerados.latitud,
        longitud: data.conglomerados.longitud
      } : null,
      message: "Conglomerado actualizado correctamente"
    });

  } catch (error) {
    console.error(" Error al actualizar conglomerado:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

export const getUsuarios = async (req, res) => {
  try {
    console.log(" Obteniendo lista de usuarios");
    
    const { data, error } = await supabase
      .from("brigadistas")
      .select("id_brigadista, usuario, rol, conglomerado_id");

    if (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener usuarios"
    });
  }
};
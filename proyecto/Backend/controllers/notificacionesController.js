import { supabase } from "../config/supabaseClient.js";

// Crear notificación de incidencia mayor
export const crearNotificacionIncidencia = async (req, res) => {
  try {
    const { categoria, descripcion, conglomerado_id, usuario_creador } = req.body;

    console.log('🚨 Creando notificación de incidencia mayor:', {
      categoria, conglomerado_id, usuario_creador
    });

    // Validar campos requeridos
    if (!categoria || !descripcion || !conglomerado_id || !usuario_creador) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos: categoria, descripcion, conglomerado_id, usuario_creador'
      });
    }

    // 1. Obtener información del conglomerado
    console.log('🔍 Buscando conglomerado:', conglomerado_id);
    const { data: conglomerado, error: errorConglomerado } = await supabase
      .from("conglomerados")
      .select("id_conglomerado, nombre")
      .eq("id_conglomerado", conglomerado_id)
      .single();

    if (errorConglomerado || !conglomerado) {
      console.error('❌ Error obteniendo conglomerado:', errorConglomerado);
      return res.status(404).json({
        success: false,
        message: 'Conglomerado no encontrado'
      });
    }

    console.log('📍 Conglomerado encontrado:', conglomerado.nombre);

    // 2. Buscar brigadistas del conglomerado (excluyendo al creador)
    console.log('🔍 Buscando brigadistas del conglomerado');
    const { data: brigadistas, error: errorBrigadistas } = await supabase
      .from("brigadistas")
      .select("usuario")
      .eq("conglomerado_id", conglomerado_id)
      .neq("usuario", usuario_creador);

    if (errorBrigadistas) {
      console.error('❌ Error buscando brigadistas:', errorBrigadistas);
      return res.status(500).json({
        success: false,
        message: 'Error al buscar brigadistas del conglomerado'
      });
    }

    console.log(`👥 Brigadistas encontrados: ${brigadistas?.length || 0}`);

    if (!brigadistas || brigadistas.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay otros brigadistas en este conglomerado para notificar'
      });
    }

    // 3. Crear notificación
    console.log('💾 Creando notificación en base de datos');
    const { data: notificacion, error: errorNotificacion } = await supabase
      .from("notificaciones")
      .insert([{
        tipo: 'incidencia_mayor',
        categoria: categoria,
        descripcion: descripcion,
        conglomerado_id: conglomerado_id,
        conglomerado_nombre: conglomerado.nombre,
        usuario_creador: usuario_creador,
        activa: true
      }])
      .select()
      .single();

    if (errorNotificacion) {
      console.error('❌ Error creando notificación:', errorNotificacion);
      return res.status(500).json({
        success: false,
        message: 'Error al crear notificación en la base de datos'
      });
    }

    console.log('✅ Notificación creada con ID:', notificacion.id);

    // 4. Crear registros para cada brigadista
    const usuariosNotificadosData = brigadistas.map(brigadista => ({
      notificacion_id: notificacion.id,
      usuario: brigadista.usuario,
      confirmado: false
    }));

    console.log(`👥 Creando ${usuariosNotificadosData.length} registros de usuarios notificados`);
    const { error: errorUsuariosNotificados } = await supabase
      .from("notificaciones_usuarios")
      .insert(usuariosNotificadosData);

    if (errorUsuariosNotificados) {
      console.error('❌ Error creando registros de usuarios:', errorUsuariosNotificados);
      // No fallamos la notificación principal si esto falla
    }

    console.log('🎉 Notificación completada exitosamente');

    res.status(201).json({
      success: true,
      message: `Notificación enviada a ${brigadistas.length} brigadistas del conglomerado ${conglomerado.nombre}`,
      data: {
        notificacion_id: notificacion.id,
        conglomerado_nombre: conglomerado.nombre,
        usuarios_notificados: brigadistas.length
      }
    });

  } catch (error) {
    console.error('💥 Error en crearNotificacionIncidencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear notificación'
    });
  }
};

// Confirmar notificación
export const confirmarNotificacion = async (req, res) => {
  try {
    const { notificacion_id, usuario } = req.body;

    console.log('✅ Confirmando notificación:', { notificacion_id, usuario });

    if (!notificacion_id || !usuario) {
      return res.status(400).json({
        success: false,
        message: 'notificacion_id y usuario son requeridos'
      });
    }

    // Actualizar confirmación
    const { error } = await supabase
      .from("notificaciones_usuarios")
      .update({
        confirmado: true,
        fecha_confirmacion: new Date().toISOString()
      })
      .eq("notificacion_id", notificacion_id)
      .eq("usuario", usuario);

    if (error) {
      console.error('❌ Error confirmando notificación:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al confirmar notificación'
      });
    }

    console.log('👍 Notificación confirmada por:', usuario);

    res.json({
      success: true,
      message: 'Notificación confirmada exitosamente'
    });

  } catch (error) {
    console.error('💥 Error en confirmarNotificacion:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al confirmar notificación'
    });
  }
};

// Obtener notificaciones pendientes de un usuario - CORREGIDO
export const getNotificacionesPendientes = async (req, res) => {
  try {
    const { usuario } = req.params;

    console.log('🔍 Buscando notificaciones pendientes para:', usuario);

    if (!usuario) {
      return res.status(400).json({
        success: false,
        message: 'usuario es requerido'
      });
    }

    // CONSULTA CORREGIDA - SIN ORDENAMIENTO COMPLEJO QUE CAUSA ERROR
    const { data: notificacionesUsuario, error } = await supabase
      .from("notificaciones_usuarios")
      .select(`
        notificacion_id,
        confirmado,
        notificaciones (
          id,
          tipo,
          categoria,
          descripcion,
          conglomerado_id,
          conglomerado_nombre,
          usuario_creador,
          fecha_creacion
        )
      `)
      .eq("usuario", usuario)
      .eq("confirmado", false)
      .eq("notificaciones.activa", true);

    if (error) {
      console.error('❌ Error buscando notificaciones:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener notificaciones'
      });
    }

    console.log(`📬 Notificaciones pendientes encontradas: ${notificacionesUsuario?.length || 0}`);

    // ORDENAR MANUALMENTE POR FECHA (más reciente primero)
    const notificaciones = (notificacionesUsuario || [])
      .map(item => ({
        id: item.notificaciones.id,
        tipo: item.notificaciones.tipo,
        categoria: item.notificaciones.categoria,
        descripcion: item.notificaciones.descripcion,
        conglomerado_id: item.notificaciones.conglomerado_id,
        conglomerado_nombre: item.notificaciones.conglomerado_nombre,
        usuario_creador: item.notificaciones.usuario_creador,
        fecha_creacion: item.notificaciones.fecha_creacion
      }))
      .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));

    res.json({
      success: true,
      data: notificaciones
    });

  } catch (error) {
    console.error('💥 Error en getNotificacionesPendientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener notificaciones'
    });
  }
};
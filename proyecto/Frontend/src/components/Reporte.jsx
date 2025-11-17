// -------------------------------------------------------------
// Importaciones necesarias
// -------------------------------------------------------------
import React, { useState, useEffect, useRef } from "react";

// Importar axios para llamadas al backend
import axios from "axios";

// Importar jsPDF correctamente (sin llaves)
import jsPDF from "jspdf";

// Registrar AutoTable correctamente
import autoTable from "jspdf-autotable";

// Importar Chart.js (para generar gráficas internas)
import Chart from "chart.js/auto";

// Importar estilos
import "../assets/css/reporte.css";

// Importar logo (asegúrate que exista la imagen)
import logo from "../assets/img/Ideam_(Colombia)_logo.png";

// -------------------------------------------------------------
// Componente principal
// -------------------------------------------------------------
const ReportePDFProfesional = () => {
  // Datos del usuario desde localStorage
  const [userInfo, setUserInfo] = useState({});
  
  // Datos que devuelve el backend al pedir el reporte
  const [datosReporte, setDatosReporte] = useState(null);
  
  // Estados de carga y errores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Referencia al canvas donde Chart.js dibuja la gráfica
  const chartRef = useRef(null);

  // -------------------------------------------------------------
  // Cargar datos del usuario al iniciar el componente
  // -------------------------------------------------------------
  useEffect(() => {
    const loadUserInfo = () => {
      const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
      console.log("📋 UserInfo cargado:", userData);
      console.log("📋 Conglomerado del usuario:", userData.conglomerado);
      setUserInfo(userData);
    };

    loadUserInfo();
    
    // Escuchar cambios en el localStorage
    const handleStorageChange = () => {
      console.log("🔄 Cambio detectado en localStorage");
      loadUserInfo();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // -------------------------------------------------------------
  // Función: obtener el ID del conglomerado correctamente
  // -------------------------------------------------------------
  const obtenerIdConglomerado = () => {
    if (!userInfo.conglomerado) return null;

    // Debug: mostrar estructura del conglomerado
    console.log("🔍 Estructura del conglomerado:", userInfo.conglomerado);
    
    // Intentar diferentes posibles nombres de propiedad
    const idConglomerado = 
      userInfo.conglomerado.id_conglomerado || 
      userInfo.conglomerado.id ||
      userInfo.conglomerado.conglomerado_id;
    
    console.log("🔍 ID del conglomerado obtenido:", idConglomerado);
    return idConglomerado;
  };

  // -------------------------------------------------------------
  // Función: solicitar datos del reporte al backend
  // -------------------------------------------------------------
  const obtenerDatosReporte = async () => {
    const idConglomerado = obtenerIdConglomerado();
    
    if (!idConglomerado) {
      setError("No tienes un conglomerado asignado o el ID no es válido. Por favor, selecciona un conglomerado primero.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("📡 Solicitando reporte para conglomerado:", idConglomerado);
      
      const res = await axios.get(
        `http://localhost:4000/api/reportes/${idConglomerado}`
      );

      if (res.data.success) {
        setDatosReporte(res.data.data);
        console.log("✅ Datos del reporte obtenidos:", res.data.data);
      } else {
        setError("Error al obtener los datos del reporte.");
      }

    } catch (error) {
      console.error("❌ Error obteniendo datos:", error);
      if (error.response?.status === 404) {
        setError("Conglomerado no encontrado. Verifica que el conglomerado exista en el sistema.");
      } else {
        setError("Error al conectar con el servidor. Verifica tu conexión.");
      }
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // Función: generar y descargar el PDF
  // -------------------------------------------------------------
  const generarPDF = async () => {
    if (!datosReporte) {
      setError("Primero debes obtener los datos del reporte.");
      return;
    }

    try {
      const doc = new jsPDF();

      // -----------------------------------------------------------
      // Agregar logo
      // -----------------------------------------------------------
      try {
        doc.addImage(logo, "PNG", 10, 10, 30, 30);
      } catch (err) {
        console.warn("⚠ No se pudo cargar el logo:", err);
      }

      // -----------------------------------------------------------
      // Título
      // -----------------------------------------------------------
      doc.setFontSize(18);
      doc.text("Reporte  del Conglomerado", 60, 20);

      // Información del usuario
      doc.setFontSize(11);
      doc.text(`Generado por: ${userInfo.nombre || "Usuario"}`, 60, 28);
      doc.text(`Rol: ${userInfo.rol || "No especificado"}`, 60, 35);
      doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 60, 42);

      // -----------------------------------------------------------
      // Tabla con información del conglomerado
      // -----------------------------------------------------------
      autoTable(doc, {
        startY: 55,
        theme: "striped",
        head: [["Campo", "Valor"]],
        body: [
          ["ID", datosReporte.id || "N/A"],
          ["Nombre", datosReporte.nombre || "N/A"],
          ["Latitud", datosReporte.ubicacion?.latitud || "N/A"],
          ["Longitud", datosReporte.ubicacion?.longitud || "N/A"],
        ],
      });

      // -----------------------------------------------------------
      // Tabla resumen (individuos, muestras)
      // -----------------------------------------------------------
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        theme: "grid",
        head: [["Indicador", "Valor"]],
        body: [
          ["Total individuos", datosReporte.resumen?.total_individuos || 0],
          ["Total muestras", datosReporte.resumen?.total_muestras || 0],
        ],
      });

      // -----------------------------------------------------------
      // Generar gráfica dentro del PDF solo si hay datos
      // -----------------------------------------------------------
      const totalIndividuos = datosReporte.resumen?.total_individuos || 0;
      const totalMuestras = datosReporte.resumen?.total_muestras || 0;

      if (totalIndividuos > 0 || totalMuestras > 0) {
        // 1. Crear gráfica en un canvas invisible
        const ctx = chartRef.current.getContext("2d");

        // Destruir gráfico previo si existe
        if (chartRef.current.chartInstance) {
          chartRef.current.chartInstance.destroy();
        }

        // Crear gráfica
        chartRef.current.chartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Individuos", "Muestras"],
            datasets: [
              {
                label: "Totales",
                data: [totalIndividuos, totalMuestras],
                backgroundColor: ["#4CAF50", "#2196F3"],
              },
            ],
          },
          options: {
            responsive: false,
            animation: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              title: {
                display: true,
                text: 'Resumen del Conglomerado'
              }
            }
          },
        });

        // Esperar que renderice
        await new Promise((resolve) => setTimeout(resolve, 500));

        // 2. Convertir gráfica a imagen
        const chartImage = chartRef.current.toDataURL("image/png");

        // 3. Insertarla en el PDF
        doc.addImage(
          chartImage,
          "PNG",
          40,
          doc.lastAutoTable.finalY + 10,
          130,
          70
        );
      } else {
        // Mensaje si no hay datos para la gráfica
        doc.text("No hay datos suficientes para generar la gráfica", 60, doc.lastAutoTable.finalY + 20);
      }

      // -----------------------------------------------------------
      // Pie de página
      // -----------------------------------------------------------
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          `Página ${i} de ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }

      // -----------------------------------------------------------
      // Guardar PDF
      // -----------------------------------------------------------
      const fileName = `Reporte_${datosReporte.nombre || 'Conglomerado'}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error("Error generando PDF:", error);
      setError("Error al generar el PDF. Intenta nuevamente.");
    }
  };

  // -------------------------------------------------------------
  // Render del componente
  // -------------------------------------------------------------
  return (
    <div className="contenedor-reporte">
      <h2>Generador de Reporte Profesional</h2>

      {/* Información del usuario y conglomerado */}
      <div className="panel-info-usuario">
        <div className="info-card">
          <h4>Información Actual</h4>
          <p><strong>Usuario:</strong> {userInfo.nombre || "No identificado"}</p>
          <p><strong>Rol:</strong> {userInfo.rol || "No asignado"}</p>
          <p>
            <strong>Conglomerado:</strong>{" "}
            {userInfo.conglomerado ? (
              <span className="conglomerado-activo">
                {userInfo.conglomerado.nombre} 
                {obtenerIdConglomerado() && ` (ID: ${obtenerIdConglomerado()})`}
              </span>
            ) : (
              <span className="conglomerado-inactivo">
                No asignado. Ve al menú superior para seleccionar uno.
              </span>
            )}
          </p>

        </div>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Panel de control */}
      <div className="panel-control">
        <button 
          onClick={obtenerDatosReporte} 
          disabled={loading || !userInfo.conglomerado}
          className="btn btn-primary"
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Cargando datos...
            </>
          ) : (
            "Obtener datos del reporte"
          )}
        </button>

        <button 
          onClick={generarPDF} 
          disabled={!datosReporte || loading}
          className="btn btn-success"
        >
          Generar PDF Profesional
        </button>
      </div>

      {/* Vista previa de datos */}
      {datosReporte && (
        <div className="vista-previa">
          <h4>Vista previa de datos</h4>
          <div className="datos-resumen">
            <p><strong>Conglomerado:</strong> {datosReporte.nombre}</p>
            <p><strong>Individuos registrados:</strong> {datosReporte.resumen?.total_individuos || 0}</p>
            <p><strong>Muestras recolectadas:</strong> {datosReporte.resumen?.total_muestras || 0}</p>
          </div>
        </div>
      )}

      {/* Canvas oculto donde se dibuja la gráfica */}
      <canvas
        ref={chartRef}
        width={400}
        height={300}
        style={{ display: "none" }}
      ></canvas>
    </div>
  );
};

export default ReportePDFProfesional;
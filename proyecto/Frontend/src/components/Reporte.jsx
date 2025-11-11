import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Chart from "chart.js/auto";
import "../assets/css/reporte.css";

const ReportePDFProfesional = () => {
  const [conglomerados, setConglomerados] = useState([]);
  const [idConglomerado, setIdConglomerado] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfBlob, setPdfBlob] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [generatingPreview, setGeneratingPreview] = useState(false);

  const chartSubparcelasRef = useRef(null);
  const chartCategoriasRef = useRef(null);
  const previewIframeRef = useRef(null);

  // 🔹 Cargar conglomerados para el select
  useEffect(() => {
    const fetchConglomerados = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/conglomerados");
        setConglomerados(res.data || []);
      } catch (err) {
        console.error("Error cargando conglomerados:", err);
        setError("No se pudieron cargar los conglomerados.");
      }
    };
    fetchConglomerados();
  }, []);

  // 🔹 Cargar datos del reporte
  useEffect(() => {
    if (!idConglomerado) return;
    setData(null);
    setError("");
    setPdfBlob(null);
    const fetchReporte = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:4000/api/reportes/${idConglomerado}`);
        console.log("Datos recibidos del backend:", res.data);
        setData(res.data);
      } catch (err) {
        console.error("Error cargando reporte:", err);
        setError("No se pudo obtener el reporte del conglomerado.");
      } finally {
        setLoading(false);
      }
    };
    fetchReporte();
  }, [idConglomerado]);

  // 🔹 Generar gráficos en pantalla
  useEffect(() => {
    if (!data) return;

    // Destruir gráficos anteriores
    if (chartSubparcelasRef.current) chartSubparcelasRef.current.destroy();
    if (chartCategoriasRef.current) chartCategoriasRef.current.destroy();

    // Gráfico de Subparcelas - Basado en la estructura de tu backend
    const subparcelas = data.subparcelas || [];
    const subparcelasOrdenadas = [1, 2, 3, 4].map(num => {
      const sub = subparcelas.find(s => s.numero_subparcela === num) || {};
      return { 
        numero: num, 
        individuos: sub.individuos || 0, 
        muestras: sub.muestras || 0 
      };
    });

    // Gráfico de Subparcelas
    const ctxSubparcelas = document.getElementById("chart-subparcelas");
    if (ctxSubparcelas) {
      chartSubparcelasRef.current = new Chart(ctxSubparcelas.getContext("2d"), {
        type: "bar",
        data: {
          labels: subparcelasOrdenadas.map(s => `Subparcela ${s.numero}`),
          datasets: [
            {
              label: "Individuos Arbóreos",
              data: subparcelasOrdenadas.map(s => s.individuos),
              backgroundColor: "#2E7D32",
              borderColor: "#1B5E20",
              borderWidth: 2
            },
            {
              label: "Muestras Botánicas",
              data: subparcelasOrdenadas.map(s => s.muestras),
              backgroundColor: "#4CAF50",
              borderColor: "#388E3C",
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Distribución por Subparcelas",
              font: { size: 16, weight: 'bold' }
            },
            legend: {
              position: 'top',
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cantidad'
              }
            }
          }
        }
      });
    }

    // Gráfico de Categorías - Basado en la estructura de tu backend
    const categorias = data.categorias || [];
    const ctxCategorias = document.getElementById("chart-categorias");
    if (ctxCategorias && categorias.length > 0) {
      chartCategoriasRef.current = new Chart(ctxCategorias.getContext("2d"), {
        type: "doughnut",
        data: {
          labels: categorias.map(c => c.nombre),
          datasets: [{
            data: categorias.map(c => c.cantidad),
            backgroundColor: [
              "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD",
              "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"
            ],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Distribución por Categorías",
              font: { size: 16, weight: 'bold' }
            },
            legend: {
              position: 'right',
            }
          }
        }
      });
    }

  }, [data]);

  // 🔹 Función para generar el PDF
  const generarPDF = async (forPreview = false) => {
    if (!data) return;
    
    if (forPreview) {
      setGeneratingPreview(true);
    } else {
      setLoading(true);
    }

    try {
      const doc = new jsPDF();
      let y = 20;

      // Logo y Encabezado
      doc.setFillColor(46, 125, 50);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("INVENTARIO FORESTAL NACIONAL", 105, 15, { align: "center" });
      
      doc.setFontSize(16);
      doc.text("Reporte de Conglomerado", 105, 25, { align: "center" });
      
      doc.setFontSize(12);
      doc.text(`Generado: ${new Date().toLocaleDateString('es-CO')}`, 105, 35, { align: "center" });

      y = 50;

      // Información del Conglomerado
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("INFORMACIÓN DEL CONGLOMERADO", 14, y);
      y += 10;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      
      // Información básica del conglomerado
      const conglomeradoInfo = [
        `• Nombre: ${data.conglomeradoNombre || "N/A"}`,
        `• Categoría más frecuente: ${data.categoriaMasFrecuente || "N/A"}`,
        `• Total individuos registrados: ${data.individuos?.length || 0}`,
        `• Total muestras botánicas: ${data.muestras?.length || 0}`,
        `• Número de subparcelas: ${data.subparcelas?.length || 0}`
      ];

      conglomeradoInfo.forEach(info => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(info, 20, y);
        y += 6;
      });
      y += 10;

      // Tabla de Subparcelas - Adaptada a tu estructura de datos
      if (data.subparcelas && data.subparcelas.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.text("DISTRIBUCIÓN POR SUBPARCELAS", 14, y);
        y += 10;

        const tablaSubparcelas = data.subparcelas.map(sub => [
          `Subparcela ${sub.numero_subparcela}`,
          sub.individuos || 0,
          sub.muestras || 0,
          (sub.individuos || 0) + (sub.muestras || 0)
        ]);

        // Ordenar por número de subparcela
        tablaSubparcelas.sort((a, b) => parseInt(a[0].split(' ')[1]) - parseInt(b[0].split(' ')[1]));

        doc.autoTable({
          startY: y,
          head: [["Subparcela", "Individuos", "Muestras", "Total"]],
          body: tablaSubparcelas,
          theme: "grid",
          headStyles: { 
            fillColor: [46, 125, 50],
            textColor: 255,
            fontStyle: 'bold'
          },
          styles: { 
            halign: "center",
            fontSize: 10
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245]
          }
        });
        y = doc.lastAutoTable.finalY + 15;
      }

      // Estadísticas Resumen
      doc.setFont("helvetica", "bold");
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.text("ESTADÍSTICAS RESUMEN", 14, y);
      y += 10;

      doc.setFont("helvetica", "normal");
      
      // Calcular estadísticas adicionales
      const totalIndividuos = data.individuos?.length || 0;
      const totalMuestras = data.muestras?.length || 0;
      const subparcelaMasPoblada = data.subparcelas?.reduce((max, sub) => 
        (sub.individuos || 0) > (max.individuos || 0) ? sub : max, {individuos: 0});
      
      const stats = [
        `Total de individuos arbóreos: ${totalIndividuos}`,
        `Total de muestras botánicas: ${totalMuestras}`,
        `Subparcela más poblada: ${subparcelaMasPoblada ? `Subparcela ${subparcelaMasPoblada.numero_subparcela}` : 'N/A'}`,
        `Categoría predominante: ${data.categoriaMasFrecuente || 'N/A'}`,
        `Relación muestras/individuos: ${totalIndividuos > 0 ? ((totalMuestras / totalIndividuos) * 100).toFixed(1) + '%' : '0%'}`
      ];

      stats.forEach(stat => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(`• ${stat}`, 20, y);
        y += 6;
      });
      y += 10;

      // Función para agregar gráficos al PDF
      const addChartToPDF = (chartId, title, yPosition) => {
        const canvas = document.getElementById(chartId);
        if (canvas) {
          try {
            if (yPosition > 250) {
              doc.addPage();
              yPosition = 20;
            }
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text(title, 14, yPosition);
            
            const chartImage = canvas.toDataURL("image/png", 1.0);
            doc.addImage(chartImage, "PNG", 14, yPosition + 5, 180, 80);
            return yPosition + 95;
          } catch (error) {
            console.error(`Error agregando gráfico ${chartId}:`, error);
            return yPosition;
          }
        }
        return yPosition;
      };

      // Agregar gráficos al PDF
      y = addChartToPDF("chart-subparcelas", "DISTRIBUCIÓN POR SUBPARCELAS", y);
      y = addChartToPDF("chart-categorias", "DISTRIBUCIÓN POR CATEGORÍAS", y);

      // Pie de página en todas las páginas
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(
          `Página ${i} de ${pageCount} - Reporte IFN Colombia - ${new Date().toLocaleDateString('es-CO')}`,
          105,
          290,
          { align: "center" }
        );
      }

      const pdfBlobGenerated = doc.output("blob");
      
      if (forPreview) {
        // Para previsualización
        const url = URL.createObjectURL(pdfBlobGenerated);
        if (previewIframeRef.current) {
          previewIframeRef.current.src = url;
        }
        setPreviewVisible(true);
      } else {
        // Para descarga
        setPdfBlob(pdfBlobGenerated);
      }

    } catch (err) {
      console.error("Error generando PDF:", err);
      setError("Error generando el reporte PDF.");
    } finally {
      if (forPreview) {
        setGeneratingPreview(false);
      } else {
        setLoading(false);
      }
    }
  };

  const descargarPDF = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Reporte_${data.conglomeradoNombre}_${new Date().toISOString().split('T')[0]}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const previsualizarPDF = () => {
    generarPDF(true);
  };

  const cerrarPreview = () => {
    setPreviewVisible(false);
    if (previewIframeRef.current) {
      URL.revokeObjectURL(previewIframeRef.current.src);
      previewIframeRef.current.src = "";
    }
  };

  return (
    <div className="reporte-container">
      <div className="reporte-header">
        <h1>📊 Reporte de Conglomerado - IFN Colombia</h1>
        <p>Genere reportes PDF profesionales con gráficos y estadísticas detalladas</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="controls-section">
        <div className="form-group">
          <label>Seleccione un conglomerado:</label>
          <select 
            value={idConglomerado} 
            onChange={e => setIdConglomerado(e.target.value)}
            className="form-select"
            disabled={loading}
          >
            <option value="">-- Seleccione un conglomerado --</option>
            {conglomerados.map(c => (
              <option key={c.id_conglomerado} value={c.id_conglomerado}>
                {c.nombre} {c.estado ? `- ${c.estado}` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          Cargando datos del conglomerado...
        </div>
      )}

      {data && (
        <div className="reporte-content">
          {/* Información Resumen */}
          <div className="resumen-section">
            <h3>Resumen del Conglomerado: {data.conglomeradoNombre}</h3>
            <div className="resumen-grid">
              <div className="resumen-card">
                <h4>📊 Individuos Arbóreos</h4>
                <p className="resumen-number">{data.individuos?.length || 0}</p>
              </div>
              <div className="resumen-card">
                <h4>🌿 Muestras Botánicas</h4>
                <p className="resumen-number">{data.muestras?.length || 0}</p>
              </div>
              <div className="resumen-card">
                <h4>📍 Subparcelas</h4>
                <p className="resumen-number">{data.subparcelas?.length || 0}</p>
              </div>
              <div className="resumen-card">
                <h4>🏷️ Categoría Principal</h4>
                <p className="resumen-text">{data.categoriaMasFrecuente || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="charts-section">
            <h3>Gráficos y Visualizaciones</h3>
            <div className="charts-grid">
              <div className="chart-container">
                <canvas id="chart-subparcelas" width={400} height={300}></canvas>
              </div>
              <div className="chart-container">
                <canvas id="chart-categorias" width={400} height={300}></canvas>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="action-buttons">
            <button 
              onClick={previsualizarPDF} 
              disabled={generatingPreview}
              className="btn btn-preview"
            >
              {generatingPreview ? (
                <>
                  <div className="spinner-small"></div>
                  Generando Vista Previa...
                </>
              ) : (
                "👁️ Previsualizar PDF"
              )}
            </button>
            
            <button 
              onClick={() => generarPDF(false)} 
              disabled={loading}
              className="btn btn-generate"
            >
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  Generando PDF...
                </>
              ) : (
                "📄 Generar PDF"
              )}
            </button>
            
            {pdfBlob && (
              <button onClick={descargarPDF} className="btn btn-download">
                ⬇️ Descargar PDF
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal de previsualización */}
      {previewVisible && (
        <div className="preview-modal">
          <div className="preview-modal-content">
            <div className="preview-header">
              <h3>Vista Previa del Reporte PDF - {data?.conglomeradoNombre}</h3>
              <button onClick={cerrarPreview} className="btn-close">×</button>
            </div>
            <div className="preview-body">
              <iframe
                ref={previewIframeRef}
                title="Vista previa del PDF"
                width="100%"
                height="600"
                style={{ border: 'none' }}
              />
            </div>
            <div className="preview-footer">
              <button onClick={descargarPDF} className="btn btn-download">
                ⬇️ Descargar PDF
              </button>
              <button onClick={cerrarPreview} className="btn btn-secondary">
                Cerrar Vista Previa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportePDFProfesional;
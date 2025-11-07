import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Chart from "chart.js/auto";
import "../assets/css/reporte.css"; // Puedes añadir estilos CSS personalizados

const ReportePDFProfesional = () => {
  const [conglomerados, setConglomerados] = useState([]);
  const [idConglomerado, setIdConglomerado] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfBlob, setPdfBlob] = useState(null);

  const chartSubparcelasRef = useRef(null);
  const chartCategoriasRef = useRef(null);

  // 🔹 Cargar conglomerados para el select
  useEffect(() => {
    const fetchConglomerados = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/conglomerados");
        setConglomerados(res.data || []);
      } catch (err) {
        console.error(err);
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
    const fetchReporte = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/reportes/${idConglomerado}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("No se pudo obtener el reporte.");
      }
    };
    fetchReporte();
  }, [idConglomerado]);

  // 🔹 Generar gráficos en pantalla
  useEffect(() => {
    if (!data) return;

    // Subparcelas
    const subparcelas = [1,2,3,4].map(num => {
      const sub = data.subparcelas.find(s => s.numero_subparcela === num) || {};
      return { numero: num, individuos: sub.individuos || 0, muestras: sub.muestras || 0 };
    });

    if (chartSubparcelasRef.current) chartSubparcelasRef.current.destroy();
    chartSubparcelasRef.current = new Chart(
      document.getElementById("chart-subparcelas").getContext("2d"),
      {
        type: "bar",
        data: {
          labels: subparcelas.map(s => `Subparcela ${s.numero}`),
          datasets: [{ label: "Individuos", data: subparcelas.map(s => s.individuos), backgroundColor: ["#007BFF","#28A745","#FFC107","#DC3545"] }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
      }
    );

    // Categorías
    const categorias = data.categorias || [];
    if (chartCategoriasRef.current) chartCategoriasRef.current.destroy();
    chartCategoriasRef.current = new Chart(
      document.getElementById("chart-categorias").getContext("2d"),
      {
        type: "pie",
        data: {
          labels: categorias.map(c => c.nombre),
          datasets: [{ data: categorias.map(c => c.cantidad), backgroundColor: ["#007BFF","#28A745","#FFC107","#DC3545","#6F42C1","#20C997"] }]
        },
        options: { responsive: true }
      }
    );
  }, [data]);

  // 🔹 Generar PDF
  const generarPDF = () => {
    if (!data) return;
    setLoading(true);
    try {
      const doc = new jsPDF();
      let y = 20;

      // Título centrado
      doc.setFontSize(18);
      doc.setFont("helvetica","bold");
      doc.text("Reporte de Conglomerado", 105, y, { align: "center" });
      y += 10;

      doc.setFontSize(12);
      doc.setFont("helvetica","normal");
      doc.text(`Conglomerado: ${data.conglomeradoNombre}`, 105, y, { align: "center" });
      y += 10;
      doc.text(`Categoría más frecuente: ${data.categoriaMasFrecuente || "Sin datos"}`, 105, y, { align: "center" });
      y += 10;

      // Tabla subparcelas
      const subparcelas = [1,2,3,4].map(num => {
        const sub = data.subparcelas.find(s => s.numero_subparcela === num) || {};
        return [num, sub.individuos || 0, sub.muestras || 0];
      });

      doc.autoTable({
        startY: y,
        head: [["Subparcela","Individuos","Muestras"]],
        body: subparcelas,
        theme: "grid",
        styles: { halign:"center" },
        headStyles: { fillColor:[0,102,51], halign:"center" }
      });
      y = doc.lastAutoTable.finalY + 10;

      // Insertar gráficos (convertir canvas en PNG)
      const canvasSub = document.getElementById("chart-subparcelas");
      const canvasCat = document.getElementById("chart-categorias");
      doc.addImage(canvasSub.toDataURL("image/png"), "PNG", 14, y, 180, 80);
      y += 90;
      doc.addImage(canvasCat.toDataURL("image/png"), "PNG", 14, y, 180, 80);

      setPdfBlob(doc.output("blob"));
    } catch (err) {
      console.error(err);
      setError("Error generando PDF.");
    } finally {
      setLoading(false);
    }
  };

  const descargarPDF = () => {
    if (!pdfBlob) return;
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Reporte_${data.conglomeradoNombre}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", gap:"20px", padding:"40px" }}>
      <h1 style={{ color:"#004d00" }}>📋 Reporte de Conglomerado</h1>

      {error && <p style={{color:"red"}}>{error}</p>}

      <div style={{ display:"flex", flexDirection:"column", gap:"10px", width:"300px" }}>
        <label style={{ fontWeight:"bold" }}>Seleccione un conglomerado:</label>
        <select value={idConglomerado} onChange={e=>setIdConglomerado(e.target.value)} style={{ padding:"10px", fontSize:"16px" }}>
          <option value="">-- Seleccione --</option>
          {conglomerados.map(c=>(
            <option key={c.id_conglomerado} value={c.id_conglomerado}>{c.nombre}</option>
          ))}
        </select>
      </div>

      {idConglomerado && !data && !error && <p>Cargando datos...</p>}

      {data && (
        <>
          <div style={{ display:"flex", gap:"20px", flexWrap:"wrap", justifyContent:"center" }}>
            <canvas id="chart-subparcelas" width={400} height={200}></canvas>
            <canvas id="chart-categorias" width={400} height={200}></canvas>
          </div>

          <div style={{ marginTop:"20px", display:"flex", gap:"10px" }}>
            <button onClick={generarPDF} disabled={loading} style={{ padding:"10px 20px", fontSize:"16px", backgroundColor:"#004d00", color:"#fff", border:"none", borderRadius:"5px" }}>
              {loading ? "Generando PDF..." : "Generar PDF"}
            </button>
            {pdfBlob && <button onClick={descargarPDF} style={{ padding:"10px 20px", fontSize:"16px", backgroundColor:"#006600", color:"#fff", border:"none", borderRadius:"5px" }}>Descargar PDF</button>}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportePDFProfesional;

import { supabase } from "../config/supabaseClient.js";

// 🔹 Controlador debug (para probar en CMD / Postman)
export const obtenerReporteConglomeradoDebug = async (req, res) => {
  const { id_conglomerado } = req.params;

  try {
    const { data: conglomerado } = await supabase
      .from("conglomerados")
      .select("*")
      .eq("id_conglomerado", id_conglomerado)
      .single();

    const { data: subparcelas } = await supabase
      .from("subparcela")
      .select("*")
      .eq("id_conglomerado", id_conglomerado);

    const { data: individuos } = await supabase
      .from("individuo_arboreo")
      .select("*")
      .eq("nombre_conglomerado", conglomerado.nombre);

    const idsIndividuos = individuos.map(i => i.id);
    const { data: muestras } = await supabase
      .from("muestra")
      .select("*")
      .in("id_individuo", idsIndividuos);

    res.json({
      conglomerado,
      subparcelas,
      individuos,
      muestras
    });

  } catch (error) {
    res.status(500).json({ message: "Error interno", error });
  }
};

// 🔹 Controlador principal (para React / PDF)
export const obtenerReporteConglomerado = async (req, res) => {
  const { id_conglomerado } = req.params;

  try {
    const { data: conglomerado } = await supabase
      .from("conglomerados")
      .select("*")
      .eq("id_conglomerado", id_conglomerado)
      .single();

    const { data: subparcelas } = await supabase
      .from("subparcela")
      .select("*")
      .eq("id_conglomerado", id_conglomerado);

    const { data: individuos } = await supabase
      .from("individuo_arboreo")
      .select("*")
      .eq("nombre_conglomerado", conglomerado.nombre);

    const idsIndividuos = individuos.map(i => i.id);
    const { data: muestras } = await supabase
      .from("muestra")
      .select("*")
      .in("id_individuo", idsIndividuos);

    // Contar categorías
    const categoriaCount = {};
    individuos.forEach(i => {
      categoriaCount[i.categoria] = (categoriaCount[i.categoria] || 0) + 1;
    });

    const categoriaMasFrecuente = Object.entries(categoriaCount).sort((a,b) => b[1]-a[1])[0]?.[0] || null;
    const categorias = Object.entries(categoriaCount).map(([nombre, cantidad]) => ({ nombre, cantidad }));

    // Contar subparcelas
    const subparcelasConConteos = subparcelas.map(sub => {
      const individuosSub = individuos.filter(i => i.subparcela == sub.numero_subparcela);
      const muestrasSub = muestras.filter(m => individuosSub.some(i => i.id === m.id_individuo));
      return { ...sub, individuos: individuosSub.length, muestras: muestrasSub.length };
    });

    res.json({
      conglomeradoNombre: conglomerado.nombre,
      subparcelas: subparcelasConConteos,
      categoriaMasFrecuente,
      categorias,
      individuos,
      muestras
    });

  } catch (error) {
    res.status(500).json({ message: "Error interno", error });
  }
};

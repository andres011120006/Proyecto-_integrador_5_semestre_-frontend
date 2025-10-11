import { supabase } from "../config/supabaseClient.js";

export const getConglomerados = async (req, res) => {
  const { data, error } = await supabase.from("conglomerados").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

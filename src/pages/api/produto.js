

import { getProdutos } from "../../lib/db"; 

export default async function handler(req, res) {
  try {
    const produtos = await getProdutos(); 
    res.status(200).json(produtos);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
}

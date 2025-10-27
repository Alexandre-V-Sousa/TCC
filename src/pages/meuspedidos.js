"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../componentes/Navbar";

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
      if (!usuarioLogado) {
        window.location.href = "/login";
        return;
      }
      setUsuario(usuarioLogado);

      const { data, error } = await supabase
        .from("vendas")
        .select("*, prod(nome, valor_venda, imagem)")
        .eq("idUsuario", usuarioLogado.id_user)
        .order("dataVenda", { ascending: false });

      if (error) console.error(error);
      setPedidos(data || []);
      setLoading(false);
    };

    fetchPedidos();
  }, []);

  if (loading) return <p className="text-center mt-10">Carregando pedidos...</p>;

  return (
    <>
      <Navbar />
      <main className="bg-[#ECFFEB] min-h-screen p-6 md:p-12 text-black">
        <h1 className="text-2xl font-bold mb-6 text-center">Meus Pedidos</h1>
        {pedidos.length === 0 ? (
          <p className="text-center text-gray-600">Nenhum pedido encontrado.</p>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {pedidos.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-xl shadow-md">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold">Pedido #{p.id}</h2>
                  <span className="text-sm text-gray-500">
                    {new Date(p.dataVenda).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{p.observação}</p>
                <p className="mt-2 text-sm">
                  Entrega concluída:{" "}
                  <strong>{p.entrega_concluida ? "Sim" : "Não"}</strong>
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

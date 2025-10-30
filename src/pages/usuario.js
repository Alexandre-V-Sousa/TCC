"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShoppingCart, Shield, LogOut } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { Navbar } from "../componentes/Navbar";
import { Rodape } from "../componentes/Rodape";


export default function Usuario() {

  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [formData, setFormData] = useState({});
  const [aba, setAba] = useState("dados");
  const [pedidos, setPedidos] = useState([]);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("/perfil-padrao.png");
  const [mostrarModalFotos, setMostrarModalFotos] = useState(false);

  // Fotos predefinidas do bucket
  const fotosPredefinidas = [
    "https://kdqjnyhhxbafdhgwpzhq.supabase.co/storage/v1/object/public/perfil/perfil1.jpg",
    "https://kdqjnyhhxbafdhgwpzhq.supabase.co/storage/v1/object/public/perfil/perfil2.jpg",
    "https://kdqjnyhhxbafdhgwpzhq.supabase.co/storage/v1/object/public/perfil/perfil3.jpg",
    "https://kdqjnyhhxbafdhgwpzhq.supabase.co/storage/v1/object/public/perfil/perfil4.jpg",
    "https://kdqjnyhhxbafdhgwpzhq.supabase.co/storage/v1/object/public/perfil/perfil5.jpg",
  ];

  // Carrega usuário e pedidos
  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) {
      router.push("/login");
      return;
    }

    const fetchUsuario = async () => {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id_user", usuarioLogado.id_user)
        .single();
      if (error) {
        console.error(error);
        alert("Erro ao carregar usuário");
        return;
      }
      setUsuario(data);
      setFormData(data);
      if (data.imagemUsuario) setFotoPerfil(data.imagemUsuario);
    };

    const fetchPedidos = async () => {
      const { data, error } = await supabase
        .from("vendas")
        .select("*, items(*)")
        .eq("id_user", usuarioLogado.id_user)
        .order("created_at", { ascending: false });
      if (!error) setPedidos(data || []);
    };

    fetchUsuario();
    fetchPedidos();
  }, [router]);

  if (!usuario) return <p className="text-black text-center mt-10">Carregando...</p>;

  // ===== Funções =====
  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    router.push("/login");
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSalvar = async () => {
    const dadosAtualizados = { ...formData };
    delete dadosAtualizados.cpf;

    const { error } = await supabase
      .from("usuarios")
      .update(dadosAtualizados)
      .eq("id_user", usuario.id_user);

    if (error) {
      console.error(error);
      alert("Erro ao salvar dados.");
      return;
    }

    setUsuario({ ...usuario, ...dadosAtualizados });
    alert("Dados salvos com sucesso!");
  };

  const handleAlterarSenha = async () => {
    if (!novaSenha || novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    const { error } = await supabase
      .from("usuarios")
      .update({ senha: novaSenha })
      .eq("id_user", usuario.id_user);

    if (error) {
      console.error(error);
      alert("Erro ao alterar senha.");
      return;
    }

    setNovaSenha("");
    setConfirmarSenha("");
    alert("Senha alterada com sucesso!");
  };

  const selecionarFoto = async (url) => {
    setFotoPerfil(url);
    setMostrarModalFotos(false);

    const { error } = await supabase
      .from("usuarios")
      .update({ imagemUsuario: url })
      .eq("id_user", usuario.id_user);

    if (error) {
      console.error(error);
      alert("Erro ao salvar foto no banco");
      return;
    }

    setUsuario({ ...usuario, imagemUsuario: url });
    setFormData({ ...formData, imagemUsuario: url });
  };

  // ===== Componentes de abas =====
  const AbaDados = () => (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-green-700">Meus Dados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Nome", name: "nome" },
          { label: "CPF", name: "cpf", disabled: true },
          { label: "E-mail", name: "email" },
          { label: "Telefone", name: "telefone" },
          { label: "Cidade", name: "cidade" },
          { label: "CEP", name: "CEP" },
          { label: "Logradouro", name: "logradouro" },
          { label: "Número", name: "numero" },
          { label: "Bairro", name: "bairro" },
        ].map((item) => (
          <div key={item.name} className="flex flex-col">
            <label className="text-gray-700 font-medium">{item.label}</label>
            <input
              type="text"
              name={item.name}
              value={formData[item.name] ?? ""}
              disabled={item.disabled}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [item.name]: e.target.value,
                }))
              }
              className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${item.disabled ? "bg-gray-100" : ""
                }`}
            />
          </div>
        ))}
      </div>

      <button onClick={handleSalvar} className="mt-6 bg-green-700 text-white px-6 py-3 rounded-full font-bold hover:bg-green-800 transition-all shadow-lg">
        Salvar
      </button>
    </div>
  );

  const AbaPedidos = () => (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold mb-4 text-green-700">Meus Pedidos</h2>
      {pedidos.length === 0 ? <p>Você ainda não possui pedidos.</p> :
        pedidos.map((p) => (
          <div key={p.id} className="border border-green-700 rounded-xl p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">Pedido #{p.id}</h3>
              <span className="text-gray-500">{new Date(p.created_at).toLocaleDateString()}</span>
            </div>
            <p>Método: {String(p.method).replace("_falso", "")}</p>
            <p>Total: R$ {Number(p.amount).toFixed(2)}</p>
            {p.items && p.items.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer text-green-700 font-semibold">Ver itens</summary>
                <ul className="mt-2 list-disc ml-6 text-gray-700">
                  {p.items.map((it, i) => (
                    <li key={i}>
                      {it.nome} x{it.quantity} — R$ {(Number(it.valor || it.valor_venda || it.price) * it.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        ))
      }
    </div>
  );

  const AbaAlterarSenha = () => (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-4 text-green-700">Alterar Senha</h2>
      <div className="flex flex-col gap-4">
        <input type="password" placeholder="Nova senha" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400" />
        <input type="password" placeholder="Confirmar nova senha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400" />
        <button onClick={handleAlterarSenha} className="bg-green-700 text-white py-3 rounded-full font-bold hover:bg-green-800 transition-all">Alterar Senha</button>
      </div>
    </div>
  );

  // ===== Render =====
  return (

    <div className="min-h-screen bg-[#ECFFEB] flex text-black">
      {/* MENU LATERAL */}
      <motion.aside initial={{ x: -200, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="w-64 bg-white shadow-lg p-6 flex flex-col gap-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24 cursor-pointer" onClick={() => setMostrarModalFotos(true)}>
            <Image src={fotoPerfil} alt="Foto de Perfil" width={96} height={96} className="rounded-full object-cover border-2 border-green-700" />
          </div>
          <Link href="/" className="mt-4 text-green-700 font-semibold hover:text-green-900 transition-colors">← Início</Link>
        </div>
        <nav className="flex flex-col gap-3 text-gray-700">
          <button onClick={() => setAba("dados")} className={`flex items-center gap-2 font-semibold hover:text-green-700 ${aba === "dados" ? "text-green-700" : ""}`}><User /> Meus dados</button>
          <button onClick={() => setAba("pedidos")} className={`flex items-center gap-2 font-semibold hover:text-green-700 ${aba === "pedidos" ? "text-green-700" : ""}`}><ShoppingCart /> Meus pedidos</button>
          <button onClick={() => setAba("alterar")} className={`flex items-center gap-2 font-semibold hover:text-green-700 ${aba === "alterar" ? "text-green-700" : ""}`}><Shield /> Alterar senha</button>
          <button onClick={handleLogout} className="flex items-center gap-2 hover:text-red-600 font-semibold mt-auto"><LogOut /> Sair da conta</button>
        </nav>
      </motion.aside>

      {/* CONTEÚDO PRINCIPAL */}
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="flex-1 p-8">
        {aba === "dados" && <AbaDados />}
        {aba === "pedidos" && <AbaPedidos />}
        {aba === "alterar" && <AbaAlterarSenha />}
      </motion.main>

      {/* MODAL FOTOS */}
      <AnimatePresence>
        {mostrarModalFotos && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-white p-6 rounded-xl flex gap-4 flex-wrap max-w-md shadow-xl">
              {fotosPredefinidas.map((foto, i) => (
                <motion.div key={i} className="cursor-pointer rounded-full p-1" onClick={() => selecionarFoto(foto)} whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                  <div className={`rounded-full overflow-hidden border-4 ${fotoPerfil === foto ? "border-green-500 animate-pulse" : "border-transparent"}`}>
                    <Image src={foto} alt={`Perfil ${i}`} width={64} height={64} className="rounded-full object-cover" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

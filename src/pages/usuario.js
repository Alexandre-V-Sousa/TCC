"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link"
import { motion } from "framer-motion";
import { User, ShoppingCart, Heart, Shield, LogOut } from "lucide-react";

export default function Usuario() {
    const router = useRouter();
    const [usuario, setUsuario] = useState(null);
    const [fotoPerfil, setFotoPerfil] = useState("/perfil-padrao.png");
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
        if (!usuarioLogado) {
            router.push("/login");
            return;
        }
        setUsuario(usuarioLogado);
        setFormData(usuarioLogado);
        if (usuarioLogado.foto) setFotoPerfil(usuarioLogado.foto);
    }, []);

    if (!usuario) return <p>Carregando...</p>;

    const handleLogout = () => {
        localStorage.removeItem("usuarioLogado");
        router.push("/login");
    };

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setFotoPerfil(url);
            // Aqui você poderia enviar para o Supabase Storage
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSalvar = () => {
        alert("Dados salvos com sucesso!");
        // Aqui você poderia atualizar no Supabase
    };

    return (
        <div className="min-h-screen bg-[#ECFFEB] flex text-black">
            {/* Menu lateral */}
            <motion.aside
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="w-64 bg-white shadow-lg p-6 flex flex-col gap-6"
            >
                <motion.div
                    className="flex flex-col items-center mb-6"
                    whileHover={{ scale: 1.05 }}
                >
                    <div className="relative w-24 h-24">
                        <Image
                            src={fotoPerfil}
                            alt="Foto de Perfil"
                            width={96}
                            height={96}
                            className="rounded-full object-cover border-2 border-green-700"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFotoChange}
                            className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
                        />
                    </div>
                    <motion.div
                        className="mb-6"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    >
                        <Link
                            href="index"
                            className="inline-flex items-center gap-2 text-green-700 font-semibold hover:text-green-900 transition-colors"
                        >
                            ← Início
                        </Link>
                    </motion.div>

                </motion.div>

                <nav className="flex flex-col gap-3 text-gray-700">
                    <motion.button
                        className="flex items-center gap-2 hover:text-green-700 font-semibold"
                        whileHover={{ scale: 1.05 }}
                    >
                        <User /> Meus dados
                    </motion.button>
                    <motion.button
                        className="flex items-center gap-2 hover:text-green-700 font-semibold"
                        whileHover={{ scale: 1.05 }}
                    >
                        <ShoppingCart /> Meus pedidos
                    </motion.button>
                    <motion.button
                        className="flex items-center gap-2 hover:text-green-700 font-semibold"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Heart /> Meus pets
                    </motion.button>
                    <motion.button
                        className="flex items-center gap-2 hover:text-green-700 font-semibold"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Shield /> Alterar senha
                    </motion.button>
                    <motion.button
                        onClick={handleLogout}
                        className="flex items-center gap-2 hover:text-red-600 font-semibold mt-auto"
                        whileHover={{ scale: 1.05 }}
                    >
                        <LogOut /> Sair da conta
                    </motion.button>
                </nav>
            </motion.aside>

            {/* Conteúdo principal */}
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-1 p-8"
            >
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Meus Dados</h2>
                <p className="text-gray-600 mb-6">
                    Confira ou altere seus dados de cadastro e informações de entrega.
                </p>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                >
                    {/** Dados pessoais **/}
                    {[
                        { label: "Nome completo", name: "nome" },
                        { label: "CPF", name: "cpf", disabled: true },
                        { label: "E-mail", name: "email" },
                        { label: "Gênero", name: "genero", type: "select", options: ["Masculino", "Feminino", "Outro"] },
                        { label: "Data de nascimento", name: "data_nasc", type: "date" },
                        { label: "Telefone", name: "telefone" },
                    ].map((item) => (
                        <motion.div
                            key={item.name}
                            className="flex flex-col"
                            whileHover={{ scale: 1.02 }}
                        >
                            <label className="block text-sm font-medium text-gray-700">{item.label}</label>
                            {item.type === "select" ? (
                                <select
                                    name={item.name}
                                    value={formData[item.name] || ""}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                >
                                    {item.options.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={item.type || "text"}
                                    name={item.name}
                                    value={formData[item.name] || ""}
                                    disabled={item.disabled || false}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 ${item.disabled ? "bg-gray-100" : ""}`}
                                />
                            )}
                        </motion.div>
                    ))}

                    {/** Dados de entrega **/}
                    {[
                        { label: "CEP", name: "cep" },
                        { label: "Endereço", name: "endereco" },
                        { label: "Número", name: "numero" },
                        { label: "Cidade", name: "cidade" },
                        { label: "Estado", name: "estado" },
                    ].map((item) => (
                        <motion.div
                            key={item.name}
                            className="flex flex-col"
                            whileHover={{ scale: 1.02 }}
                        >
                            <label className="block text-sm font-medium text-gray-700">{item.label}</label>
                            <input
                                type="text"
                                name={item.name}
                                value={formData[item.name] || ""}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </motion.div>
                    ))}
                </motion.div>

                <motion.button
                    onClick={handleSalvar}
                    className="mt-6 bg-green-700 text-white px-6 py-3 rounded-full font-bold hover:bg-green-800 transition-all shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Salvar
                </motion.button>
            </motion.main>
        </div>
    );
}

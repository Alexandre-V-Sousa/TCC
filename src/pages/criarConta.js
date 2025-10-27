"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    data_nasc: "",
    telefone: "",
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",   // Adicionado
    CEP: "",      // Adicionado, maiúsculo conforme banco
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    if (
      !formData.nome ||
      !formData.cpf ||
      !formData.data_nasc ||
      !formData.email ||
      !formData.senha ||
      !formData.confirmarSenha ||
      !formData.cidade ||
      !formData.CEP
    ) {
      setError("Preencha todos os campos obrigatórios!");
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não conferem!");
      return;
    }

    // Verifica se email já existe
    const { data: existente } = await supabase
      .from("usuarios")
      .select("id")
      .eq("email", formData.email)
      .single();

    if (existente) {
      setError("Email já cadastrado!");
      return;
    }

    // Inserir novo usuário
    const { error: insertError } = await supabase.from("usuarios").insert([
      {
        nome: formData.nome,
        cpf: formData.cpf,
        data_nasc: formData.data_nasc,
        telefone: formData.telefone,
        logradouro: formData.logradouro,
        numero: formData.numero,
        bairro: formData.bairro,
        cidade: formData.cidade,   // enviado para o banco
        CEP: formData.CEP,         // enviado para o banco
        email: formData.email,
        senha: formData.senha, // ⚠️ Para produção, use hash
      },
    ]);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    alert(`Conta criada com sucesso! Bem-vindo, ${formData.nome}`);
    router.push("/login");
  };

  const inputVariant = {
    hidden: { opacity: 0, x: -30 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.12 } }),
  };

  const sideVariant = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-[#ECFFEB] px-4 text-black"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden text-black"
      >
        <div className="md:w-2/3 p-10 flex flex-col justify-center text-black">
          <motion.div className="flex justify-center mb-6">
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
          </motion.div>

          <motion.h2 className="text-3xl font-bold text-green-700 mb-6 text-center md:text-left">
            Crie sua conta
          </motion.h2>

          <AnimatePresence>
            {error && (
              <motion.p className="text-red-500 mb-4 text-center md:text-left text-sm text-black">
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {[
            { name: "nome", placeholder: "Nome completo", type: "text" },
            { name: "cpf", placeholder: "CPF", type: "text" },
            { name: "data_nasc", placeholder: "Data de nascimento", type: "date" },
            { name: "telefone", placeholder: "Telefone", type: "text" },
            { name: "logradouro", placeholder: "Logradouro", type: "text" },
            { name: "numero", placeholder: "Número", type: "text" },
            { name: "bairro", placeholder: "Bairro", type: "text" },
            { name: "cidade", placeholder: "Cidade", type: "text" },
            { name: "CEP", placeholder: "CEP", type: "text" },
            { name: "email", placeholder: "E-mail", type: "email" },
            { name: "senha", placeholder: "Senha", type: "password" },
            { name: "confirmarSenha", placeholder: "Confirmar senha", type: "password" },
          ].map((field, i) => (
            <motion.input
              key={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              variants={inputVariant}
              custom={i + 1}
              initial="hidden"
              animate="visible"
              className="w-full px-5 py-3 rounded-full border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          ))}

          <motion.button
            onClick={handleSignup}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-full font-bold transition-all shadow-md"
          >
            Criar conta
          </motion.button>
        </div>

        <motion.div className="md:w-1/3 bg-green-50 p-10 flex flex-col justify-center text-center md:text-left">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Já tem uma conta?</h2>
          <p className="text-gray-700 mb-6">
            Acesse sua conta e continue aproveitando nossas ofertas exclusivas e promoções!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/login")}
            className="w-full md:w-auto bg-white border border-green-700 text-green-700 font-bold py-3 px-6 rounded-full hover:bg-green-700 hover:text-white transition-all shadow-md"
          >
            Fazer login
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

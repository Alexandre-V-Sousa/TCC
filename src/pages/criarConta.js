"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    tipo: "fisica",
    nome: "",
    email: "",
    celular: "",
    telefone: "",
    genero: "",
    nascimento: "",
    cpf: "",
    senha: "",
    confirmarSenha: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = () => {
    if (!formData.nome || !formData.email || !formData.celular || !formData.senha || !formData.confirmarSenha) {
      setError("Preencha todos os campos obrigatórios!");
      return;
    }
    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não conferem!");
      return;
    }
    setError("");
    alert(`Conta criada com sucesso!\nBem-vindo, ${formData.nome}`);
    router.push("/"); 
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
        className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden"
      >
        {/* Lado esquerdo: Formulário de cadastro */}
        <div className="md:w-2/3 p-10 flex flex-col justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
          </motion.div>

          <motion.h2
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold text-green-700 mb-6 text-center md:text-left"
          >
            Crie sua conta
          </motion.h2>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-red-500 mb-4 text-center md:text-left text-sm"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Pessoa Física / Jurídica */}
          <motion.div
            className="flex space-x-6 mb-4"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="tipo"
                value="fisica"
                checked={formData.tipo === "fisica"}
                onChange={handleChange}
              />
              <span>Pessoa Física</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="tipo"
                value="juridica"
                checked={formData.tipo === "juridica"}
                onChange={handleChange}
              />
              <span>Pessoa Jurídica</span>
            </label>
          </motion.div>

          {/* Campos principais */}
          {[
            { name: "nome", placeholder: "Nome e sobrenome", type: "text" },
            { name: "email", placeholder: "E-mail", type: "email" },
            { name: "celular", placeholder: "DDD + Celular", type: "text" },
            { name: "telefone", placeholder: "DDD + Telefone (opcional)", type: "text" },
            { name: "genero", placeholder: "Escolha o gênero (opcional)", type: "select", options: ["Masculino","Feminino","Outro"] },
            { name: "nascimento", placeholder: "Data de nascimento", type: "date" },
            { name: "cpf", placeholder: "CPF", type: "text" },
            { name: "senha", placeholder: "Senha", type: "password" },
            { name: "confirmarSenha", placeholder: "Confirme a senha", type: "password" },
          ].map((field, i) => (
            <motion.div key={field.name} custom={i + 1} variants={inputVariant} initial="hidden" animate="visible">
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full px-5 py-3 rounded-full border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Escolha o gênero (opcional)</option>
                  {field.options.map(opt => (
                    <option key={opt} value={opt.toLowerCase()}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full px-5 py-3 rounded-full border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              )}
            </motion.div>
          ))}

          <motion.button
            onClick={handleSignup}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            custom={10}
            variants={inputVariant}
            initial="hidden"
            animate="visible"
            className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-full font-bold transition-all shadow-md"
          >
            Criar conta
          </motion.button>
        </div>

        {/* Lado direito: Benefícios */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sideVariant}
          className="md:w-1/3 bg-green-50 p-10 flex flex-col justify-center text-center md:text-left"
        >
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

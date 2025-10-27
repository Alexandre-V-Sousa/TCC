"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Preencha todos os campos!");
      return;
    }

    try {
      // Busca o usuário ignorando maiúsculas/minúsculas no email
      const { data: usuario, error: fetchError } = await supabase
        .from("usuarios")
        .select("*")
        .ilike("email", email.trim())
        .maybeSingle(); // ✅ não quebra se não encontrar

      if (fetchError) {
        console.error("Erro Supabase:", fetchError);
        setError("Erro ao buscar usuário!");
        return;
      }

      if (!usuario) {
        setError("Email ou senha incorretos!");
        return;
      }

      // Comparar senha de forma tolerante a espaços e maiúsculas/minúsculas
      const senhaDigitada = password.trim().toLowerCase();
      const senhaBanco = usuario.senha.trim().toLowerCase();

      if (senhaDigitada !== senhaBanco) {
        setError("Email ou senha incorretos!");
        return;
      }

      // Login bem-sucedido
      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      alert(`Logado com sucesso!\nBem-vindo, ${usuario.nome}`);
      router.push("/usuario");
    } catch (err) {
      console.error("Erro inesperado:", err);
      setError("Ocorreu um erro no login.");
    }
  };

  const inputVariant = {
    hidden: { opacity: 0, x: -30 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.15 } }),
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
      className="min-h-screen flex items-center justify-center bg-[#ECFFEB] px-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden"
      >
        {/* Lado esquerdo: Login */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <Image src="/logo.png" alt="Logo" width={150} height={150} />
          </motion.div>

          <motion.h2
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold text-green-700 mb-6 text-center md:text-left"
          >
            Acesse sua conta
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

          <motion.input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variants={inputVariant}
            custom={1}
            initial="hidden"
            animate="visible"
            className="w-full px-5 py-3 rounded-full border border-black mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 text-black transition-shadow duration-300 shadow-sm focus:shadow-lg"
          />

          <motion.input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variants={inputVariant}
            custom={2}
            initial="hidden"
            animate="visible"
            className="w-full px-5 py-3 rounded-full border border-black mb-6 focus:outline-none focus:ring-2 focus:ring-green-500 text-black transition-shadow duration-300 shadow-sm focus:shadow-lg"
          />

          <motion.button
            onClick={handleLogin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={inputVariant}
            custom={3}
            initial="hidden"
            animate="visible"
            className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-full font-bold transition-all shadow-md"
          >
            Entrar
          </motion.button>

          <motion.p
            variants={inputVariant}
            custom={4}
            initial="hidden"
            animate="visible"
            className="mt-4 text-center md:text-left text-gray-600 text-sm"
          >
            Esqueceu a senha?{" "}
            <span
              className="text-green-700 cursor-pointer hover:underline"
              onClick={() => alert("Função não implementada")}
            >
              Recuperar
            </span>
          </motion.p>
        </div>

        {/* Lado direito: Criar conta */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sideVariant}
          className="md:w-1/2 bg-green-50 p-10 flex flex-col justify-center text-center md:text-left"
        >
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            Criar uma conta é rápido, fácil e gratuito!
          </h2>
          <p className="text-gray-700 mb-6">
            Com a sua conta você terá acesso a ofertas exclusivas, descontos,
            poderá acompanhar pedidos e muito mais!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/criarConta")}
            className="w-full md:w-auto bg-white border border-green-700 text-green-700 font-bold py-3 px-6 rounded-full hover:bg-green-700 hover:text-white transition-all shadow-md"
          >
            Criar minha conta
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

"use client";
import { useState } from "react";
import Navbar from "../componentes/Navbar";
import Rodape from "../componentes/Rodape";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CreditCard, Money } from "lucide-react";

export default function ContatoPage() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [status, setStatus] = useState(null);
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nome || !email || !mensagem) {
            setStatus({ success: false, message: "Preencha todos os campos." });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setStatus({ success: false, message: "Digite um e-mail válido." });
            return;
        }

        setEnviando(true);
        setStatus(null);

        try {
            await new Promise((res) => setTimeout(res, 1500)); // Simula envio
            setStatus({ success: true, message: "Mensagem enviada com sucesso!" });
            setNome("");
            setEmail("");
            setMensagem("");
        } catch {
            setStatus({ success: false, message: "Erro ao enviar a mensagem." });
        } finally {
            setEnviando(false);
        }
    };

    const faqs = [
        {
            pergunta: "Como rastrear meu pedido?",
            resposta: "Após a compra, você receberá um e-mail com o código de rastreio.",
        },
        {
            pergunta: "Quais formas de pagamento são aceitas?",
            resposta: "Aceitamos cartões de crédito, débito, Pix e dinheiro.",
        },
        {
            pergunta: "Posso trocar ou devolver produtos?",
            resposta: "Sim! Consulte nossa política de trocas e devoluções para mais detalhes.",
        },
        {
            pergunta: "Informações de Entrega",
            resposta: `
- Pedido mínimo: R$ 30,00
- Área de entrega: Mogi Mirim
- Tempo estimado de entrega: 30 minutos
- Formas de pagamento: cartão (crédito e débito), Pix e dinheiro
      `,
        },
        {
            pergunta: "Informações de Retirada",
            resposta: `
- Sem valor mínimo
- Estimativa de espera: 30 minutos
- Formas de pagamento: cartão (crédito e débito), Pix e dinheiro
      `,
        },
    ];

    return (
        <>
            <Navbar />

            <main className="bg-[#ECFFEB] min-h-screen py-10 px-4 text-black">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Formulário */}
                    <section className="bg-white p-8 rounded-2xl shadow-md text-black">
                        <h1 className="text-3xl font-bold mb-4 text-green-800">
                            Contato / Ajuda
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Preencha o formulário ou use nossos contatos rápidos.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <input
                                type="email"
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <textarea
                                rows={5}
                                placeholder="Mensagem"
                                value={mensagem}
                                onChange={(e) => setMensagem(e.target.value)}
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />

                            <button
                                type="submit"
                                disabled={enviando}
                                className={`w-full bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-semibold transition-all ${enviando ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
                            >
                                {enviando ? "Enviando..." : "Enviar Mensagem"}
                            </button>
                        </form>

                        <AnimatePresence>
                            {status && (
                                <motion.p
                                    key={status.message}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`mt-4 font-semibold ${status.success ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {status.message}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        <div className="mt-8 space-y-2">
                            <h2 className="text-xl font-semibold text-gray-700">Contato rápido</h2>
                            <p>
                                <a
                                    href="tel:+551134346980"
                                    className="text-green-700 font-semibold hover:underline"
                                >
                                    📞 (19) 3806-1241
                                </a>
                            </p>
                            <p>
                                <a
                                    href="mailto:contato@seusite.com"
                                    className="text-green-700 font-semibold hover:underline"
                                >
                                    ✉ contato@seusite.com
                                </a>
                            </p>
                            <p>
                                <a
                                    href="https://wa.me/551134346980"
                                    target="_blank"
                                    className="text-green-700 font-semibold hover:underline"
                                >
                                    WhatsApp (19) 98153-7495
                                </a>
                            </p>
                        </div>
                    </section>

                    {/* FAQ e mapa */}
                    <aside className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-md">
                            <h2 className="text-2xl font-bold text-green-800 mb-4">Perguntas Frequentes</h2>
                            <div className="space-y-3">
                                {faqs.map((faq, index) => (
                                    <details
                                        key={index}
                                        className="border rounded-lg p-3 cursor-pointer hover:bg-green-50 transition"
                                    >
                                        <summary className="font-semibold">{faq.pergunta}</summary>
                                        <div className="mt-2 text-gray-600">
                                            {faq.resposta.split("\n").map((linha, i) =>
                                                linha.trim() ? (
                                                    <p key={i} className="flex items-center gap-2">
                                                        {(faq.pergunta.includes("Pagamento") || faq.pergunta.includes("Entrega") || faq.pergunta.includes("Retirada")) && (
                                                            <Clock className="w-4 h-4 text-green-700" />
                                                        )}
                                                        {linha.trim()}
                                                    </p>
                                                ) : null
                                            )}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-md">
                            <h2 className="text-2xl font-bold text-green-800 mb-4">Nosso Endereço</h2>
                            <p className="text-gray-600 mb-4">
                                Rua Argentina, 23, Vila Universitária, Mogi-Mirim, SP
                            </p>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.576837435!2d-46.17423368449501!3d-22.92842208487466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cffa3d11e4b2b3%3A0x4c6b8f814d5e2c6!2sRua%20Argentina%2C%2023%20-%20Vila%20Universit%C3%A1ria%2C%20Mogi-Mirim%20-%20SP%2C%20Brasil!5e0!3m2!1spt-BR!2sbr!4v1696080000000!5m2!1spt-BR!2sbr"
                                width="100%"
                                height="250"
                                className="rounded-xl"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>

                    </aside>
                </div>
                <Rodape />
            </main>

            
        </>
    );
}

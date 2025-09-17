// pages/index.js
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  User,
  ShoppingCart,
  Mail,
  Dog,
  Cat,
  Fish,
  Truck,
  Clock,
  CreditCard,
  Box,
  Home as HomeIcon,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  // ---------------- BANNERS ----------------
  const banners = [
    { src: "/banner1.png", alt: "Promoção especial" },
    { src: "/banner2.png", alt: "Novidades na loja" },
  ];

  const [currentBanner, setCurrentBanner] = useState(0);
  const bannerIntervalRef = useRef(null);

  const goNextBanner = () =>
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  const goPrevBanner = () =>
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);

  const startBannerAutoplay = () => {
    stopBannerAutoplay();
    bannerIntervalRef.current = setInterval(goNextBanner, 4000);
  };
  const stopBannerAutoplay = () => {
    if (bannerIntervalRef.current) clearInterval(bannerIntervalRef.current);
  };

  useEffect(() => {
    startBannerAutoplay();
    return () => stopBannerAutoplay();
  }, []);

  // ---------------- PRODUTOS ----------------
  const dogProducts = [
    { name: "Ração", img: "/cachorro/RaçãoCachorro.jpg" },
    { name: "Petiscos e Ossos", img: "/cachorro/PetiscoCachorro.jpg" },
    { name: "Higiene", img: "/cachorro/HigieneCachorro.jpg" },
    { name: "Coleiras", img: "/cachorro/ColeirasCachorro.jpg" },
    { name: "Brinquedos", img: "/cachorro/BrinquedosCachorro.jpg" },
  ];
  const catProducts = [
    { name: "Ração", img: "/gato/RaçãoGato.jpg" },
    { name: "Petiscos", img: "/gato/PetiscosGato.jpg" },
    { name: "Arranhadores", img: "/gato/ArranhadoresGato.jpg" },
    { name: "Higiene", img: "/gato/HigieneGato.jpg" },
    { name: "Brinquedos", img: "/gato/BrinquedosGato.jpg" },
  ];

  const scrollRefDog = useRef(null);
  const scrollRefCat = useRef(null);
  const scrollLeft = (ref) =>
    ref.current?.scrollBy({ left: -320, behavior: "smooth" });
  const scrollRight = (ref) =>
    ref.current?.scrollBy({ left: 320, behavior: "smooth" });

  // ---------------- DROPDOWNS ----------------
  const [openDropdown, setOpenDropdown] = useState(null); // "produtos" | "servicos" | null

  // ---------------- RETORNO ----------------
  return (
    <main className="bg-[#ECFFEB]">
      {/* Navbar */}
      <nav className="bg-[#ECFFEB] shadow relative z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="flex items-center space-x-4 md:space-x-6">
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={80}
              className="rounded-full"
            />

            {/* MENU PRINCIPAL */}
            <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-5 text-black">
              <li>
                <Link href="/" className="hover:text-green-700 font-medium">
                  Início
                </Link>
              </li>

              <li
                className="relative"
                onMouseEnter={() => setOpenDropdown("produtos")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href="/produtos"
                  className="hover:text-green-700 font-medium"
                >
                  Produtos
                </Link>

                {openDropdown === "produtos" && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute left-0 top-8 bg-white shadow-xl rounded-xl py-2 w-56"
                  >
                    <Link
                      href="/animais/cachorro"
                      className="block px-4 py-2 hover:bg-green-100 text-gray-700"
                    >
                      Cães
                    </Link>
                    <Link
                      href="/animais/gato"
                      className="block px-4 py-2 hover:bg-green-100 text-gray-700"
                    >
                      Gatos
                    </Link>
                    <Link
                      href="/animais/peixe"
                      className="block px-4 py-2 hover:bg-green-100 text-gray-700"
                    >
                      Peixes
                    </Link>
                    <Link
                      href="/casa-e-jardim"
                      className="block px-4 py-2 hover:bg-green-100 text-gray-700"
                    >
                      Casa & Jardim
                    </Link>
                    <Link
                      href="/promocoes"
                      className="block px-4 py-2 hover:bg-green-100 text-gray-700"
                    >
                      Promoções
                    </Link>
                  </motion.div>
                )}
              </li>

              <li
                className="relative"
                onMouseEnter={() => setOpenDropdown("servicos")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  className="hover:text-green-700 font-medium"
                >
                  Serviços
                </button>

                {openDropdown === "servicos" && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute left-0 top-8 bg-white shadow-xl rounded-xl py-2 w-56"
                  >
                    <Link
                      href="/banho-e-tosa"
                      className="block px-4 py-2 hover:bg-green-100 text-gray-700"
                    >
                      Banho e Tosa
                    </Link>
                    <Link
                      href="/consultas"
                      className="block px-4 py-2 hover:bg-green-100 text-gray-700"
                    >
                      Consultas
                    </Link>
                    <Link
                      href="/vacinacao"
                      className="block px-4 py-2 hover:bg-green-100 text-gray-700"
                    >
                      Vacinação
                    </Link>
                    <Link
                      href="/adestramento"
                      className="block px-4 py-2 hover:bg-green-100 text-gray-700"
                    >
                      Adestramento
                    </Link>
                  </motion.div>
                )}
              </li>

              <li>
                <Link href="/blog" className="hover:text-green-700 font-medium">
                  Blog / Dicas
                </Link>
              </li>

              <li>
                <Link href="/animais" className="hover:text-green-700 font-medium">
                  Meus Pets
                </Link>
              </li>
            </ul>
          </div>

          {/* BUSCA */}
          <div className="w-full md:w-auto text-center md:text-left relative">
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="border border-gray-300 rounded-full px-12 py-4 w-full md:max-w-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md text-black"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z"
              />
            </svg>
          </div>

          {/* ÍCONES ANIMADOS À DIREITA */}
          <div className="flex items-center space-x-6 text-black">
            <Link href="/animais" className="relative group flex items-center cursor-pointer">
              <div className="bg-white p-2 rounded-full shadow-md transition-transform duration-300 group-hover:scale-110">
                <Dog className="text-black w-6 h-6" />
              </div>
              <span className="absolute left-1/2 -translate-x-1/2 mt-12 px-3 py-1 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-300">
                Meus Pets
              </span>
            </Link>

            <Link href="/login" className="relative group flex items-center cursor-pointer">
              <div className="bg-white p-2 rounded-full shadow-md transition-transform duration-300 group-hover:scale-110">
                <User className="text-black w-6 h-6" />
              </div>
              <span className="absolute left-1/2 -translate-x-1/2 mt-12 px-3 py-1 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-300">
                Login
              </span>
            </Link>

            <Link href="/carrinho" className="relative group flex items-center cursor-pointer">
              <div className="bg-white p-2 rounded-full shadow-md transition-transform duration-300 group-hover:scale-110">
                <ShoppingCart className="text-black w-6 h-6" />
              </div>
              <span className="absolute left-1/2 -translate-x-1/2 mt-12 px-3 py-1 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-300">
                Carrinho
              </span>
            </Link>

            <Link href="/contato" className="relative group flex items-center cursor-pointer">
              <div className="bg-white p-2 rounded-full shadow-md transition-transform duration-300 group-hover:scale-110">
                <Mail className="text-black w-6 h-6" />
              </div>
              <span className="absolute left-1/2 -translate-x-1/2 mt-12 px-3 py-1 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-300">
                Contato
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ---------------- BENEFÍCIOS ---------------- */}
      <section className="py-6 px-4 max-w-6xl mx-auto flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-3 bg-white shadow-lg rounded-2xl px-6 py-4 hover:shadow-2xl transition w-full md:w-auto">
          <Truck className="text-green-700" size={28} />
          <span className="text-gray-700 font-semibold">Frete Grátis</span>
        </div>
        <div className="flex items-center gap-3 bg-white shadow-lg rounded-2xl px-6 py-4 hover:shadow-2xl transition w-full md:w-auto">
          <Clock className="text-green-700" size={28} />
          <span className="text-gray-700 font-semibold">Entrega Rápida</span>
        </div>
        <div className="flex items-center gap-3 bg-white shadow-lg rounded-2xl px-6 py-4 hover:shadow-2xl transition w-full md:w-auto">
          <ShoppingCart className="text-green-700" size={28} />
          <span className="text-gray-700 font-semibold">Retirar na Loja</span>
        </div>
        <div className="flex items-center gap-3 bg-white shadow-lg rounded-2xl px-6 py-4 hover:shadow-2xl transition w-full md:w-auto">
          <CreditCard className="text-green-700" size={28} />
          <span className="text-gray-700 font-semibold">
            Formas de Pagamento
          </span>
        </div>
      </section>

      {/* ---------------- CARROSSEL PRINCIPAL ---------------- */}
      <section className="relative mt-6 w-full flex justify-center">
        <div
          className="relative overflow-hidden h-56 sm:h-72 md:h-[300px] lg:h-[400px] w-[90%] rounded-2xl shadow-lg"
          onMouseEnter={stopBannerAutoplay}
          onMouseLeave={startBannerAutoplay}
        >
          {banners.map((banner, index) => (
            <div
              key={index}
              className="absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(${(index - currentBanner) * 100}%)`,
              }}
            >
              <Image
                src={banner.src}
                alt={banner.alt}
                fill
                style={{ objectFit: "cover", borderRadius: "1rem" }}
                priority={index === 0}
              />
            </div>
          ))}

          {/* Botões do carrossel */}
          <button
            onClick={goPrevBanner}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white text-black shadow-md p-3 rounded-full z-20 hover:scale-110 transition-transform"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={goNextBanner}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black shadow-md p-3 rounded-full z-20 hover:scale-110 transition-transform"
          >
            <ChevronRight size={20} />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-4 w-full flex justify-center gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentBanner === index
                    ? "bg-green-700 scale-125"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CATEGORIAS ---------------- */}
      <section className="py-10 px-4 max-w-6xl mx-auto flex flex-wrap justify-center gap-4">
        <Link
          href="/animais/cachorro"
          className="flex items-center gap-3 px-6 py-4 bg-white text-green-700 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition text-lg justify-center"
        >
          <Dog size={24} /> Cães
        </Link>
        <Link
          href="/animais/gato"
          className="flex items-center gap-3 px-6 py-4 bg-white text-green-700 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition text-lg justify-center"
        >
          <Cat size={24} /> Gatos
        </Link>
        <Link
          href="/animais/peixe"
          className="flex items-center gap-3 px-6 py-4 bg-white text-green-700 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition text-lg justify-center"
        >
          <Fish size={24} /> Peixes
        </Link>
        <Link
          href="/animais/outros"
          className="flex items-center gap-3 px-6 py-4 bg-white text-green-700 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition text-lg justify-center"
        >
          <Box size={24} /> Outros Pets
        </Link>
        <Link
          href="/casa-e-jardim"
          className="flex items-center gap-3 px-6 py-4 bg-white text-green-700 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition text-lg justify-center"
        >
          <HomeIcon size={24} /> Casa & Jardim
        </Link>
      </section>

      {/* ---------------- CARROSSEL CÃES ---------------- */}
      <section className="py-10 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6">
          Produtos para Cães
        </h2>
        <div className="relative">
          <button
            onClick={() => scrollLeft(scrollRefDog)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
          >
            <ChevronLeft size={28} />
          </button>
          <div
            ref={scrollRefDog}
            className="flex overflow-x-auto gap-4 scrollbar-hide scroll-smooth"
          >
            {dogProducts.map((p, i) => (
              <motion.div
                key={i}
                className="min-w-[220px] bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src={p.img}
                  alt={p.name}
                  width={160}
                  height={160}
                  className="rounded-xl object-cover"
                />
                <span className="mt-3 font-medium text-gray-700">{p.name}</span>
              </motion.div>
            ))}
          </div>
          <button
            onClick={() => scrollRight(scrollRefDog)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </section>

      {/* ---------------- CARROSSEL GATOS ---------------- */}
      <section className="py-10 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6">
          Produtos para Gatos
        </h2>
        <div className="relative">
          <button
            onClick={() => scrollLeft(scrollRefCat)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
          >
            <ChevronLeft size={28} />
          </button>
          <div
            ref={scrollRefCat}
            className="flex overflow-x-auto gap-4 scrollbar-hide scroll-smooth"
          >
            {catProducts.map((p, i) => (
              <motion.div
                key={i}
                className="min-w-[220px] bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src={p.img}
                  alt={p.name}
                  width={160}
                  height={160}
                  className="rounded-xl object-cover"
                />
                <span className="mt-3 font-medium text-gray-700">{p.name}</span>
              </motion.div>
            ))}
          </div>
          <button
            onClick={() => scrollRight(scrollRefCat)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </section>
    </main>
  );
}

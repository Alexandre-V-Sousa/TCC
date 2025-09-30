// pages/index.js
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Rodape from "../componentes/Rodape";
import Navbar from "../componentes/Navbar";
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

  // mudança sut DROPDOWNS 
  const [openDropdown, setOpenDropdown] = useState(null); // "produtos" | "servicos" | null

  //  RETORNO 
  return (
    <main className="bg-[#ECFFEB]">
      <Navbar openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />

       {/*  CATEGORIAS  */}
      <motion.section
        className="py-10 px-4 max-w-6xl mx-auto flex flex-wrap justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link
          href="/produtos"
          className="flex items-center gap-3 px-6 py-4 bg-white text-green-700 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition text-lg justify-center"
        >
          <Dog size={24} /> Cães
        </Link>
        <Link
          href="/produtos"
          className="flex items-center gap-3 px-6 py-4 bg-white text-green-700 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition text-lg justify-center"
        >
          <Cat size={24} /> Gatos
        </Link>
        <Link
          href="/produtos"
          className="flex items-center gap-3 px-6 py-4 bg-white text-green-700 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition text-lg justify-center"
        >
          <Fish size={24} /> Peixes
        </Link>
        <Link
          href="/produtos"
          className="flex items-center gap-3 px-6 py-4 bg-white text-green-700 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition text-lg justify-center"
        >
          <Box size={24} /> Outros Pets
        </Link>
        <Link
          href="/produtos"
          className="flex items-center gap-3 px-6 py-4 bg-white text-green-700 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition text-lg justify-center"
        >
          <HomeIcon size={24} /> Casa & Jardim
        </Link>
      </motion.section>

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

     

      
     

      {/*mudança  CARROSSEL CÃES  */}
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

      <Rodape />
    </main>
  );
}

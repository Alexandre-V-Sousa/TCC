"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Dog, Cat, Fish, Box, Home as HomeIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";

import Navbar from "../componentes/Navbar";
import Rodape from "../componentes/Rodape";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const { addToCart, setSidebarOpen } = useCart();

  // ---------------- BANNERS ----------------
  const banners = [{ src: "/banner.png", alt: "Promoção especial" }];
  const [currentBanner, setCurrentBanner] = useState(0);
  const bannerIntervalRef = useRef(null);

  const goNextBanner = () => setCurrentBanner((prev) => (prev + 1) % banners.length);
  const goPrevBanner = () => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);

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
  const [categorias, setCategorias] = useState([]);
  const [produtosPorCategoria, setProdutosPorCategoria] = useState({});
  const categoriaRefs = useRef({});
  const scrollRefMap = useRef({});

  useEffect(() => {
    async function fetchCategoriasProdutos() {
      try {
        const { data: catData } = await supabase.from("categorias").select("*");
        setCategorias(catData || []);

        const produtosObj = {};
        for (const cat of catData) {
          const { data: prodData } = await supabase
            .from("prod")
            .select("*")
            .eq("categorias", cat.id)
            .limit(8);

          const produtosComImgs = await Promise.all(
            (prodData || []).map(async (p) => {
              const imgField = p.imagen ?? p.imagem ?? "";
              let resolved = "/placeholder.png";
              try {
                if (!imgField) resolved = "/placeholder.png";
                else if (
                  typeof imgField === "string" &&
                  (imgField.startsWith("http://") || imgField.startsWith("https://"))
                ) {
                  resolved = decodeURI(imgField);
                } else {
                  const { data: urlData } = supabase.storage
                    .from("imagen dos produtos")
                    .getPublicUrl(String(imgField));
                  resolved = urlData?.publicUrl || "/placeholder.png";
                }
              } catch {
                resolved = "/placeholder.png";
              }
              return { ...p, imagenResolved: resolved };
            })
          );
          produtosObj[cat.id] = produtosComImgs;
        }
        setProdutosPorCategoria(produtosObj);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCategoriasProdutos();
  }, []);

  // ---------------- FUNÇÕES DE SCROLL ----------------
  const scrollToCategory = (catId) => {
    const categoryEl = categoriaRefs.current[catId];
    if (categoryEl) categoryEl.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAddToCart = (produto) => {
    addToCart({
      ...produto,
      imagem: produto.imagenResolved ? [produto.imagenResolved] : ["/placeholder.png"],
      quantity: 1,
    });
    setSidebarOpen(true);
  };

  const scrollLeft = (catId) => {
    const ref = scrollRefMap.current[catId];
    if (!ref) return;
    const width = ref.offsetWidth;
    const maxScroll = ref.scrollWidth - width;
    if (ref.scrollLeft <= 0) {
      ref.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      ref.scrollBy({ left: -width / 2, behavior: "smooth" });
    }
  };

  const scrollRight = (catId) => {
    const ref = scrollRefMap.current[catId];
    if (!ref) return;
    const width = ref.offsetWidth;
    const maxScroll = ref.scrollWidth - width;
    if (ref.scrollLeft >= maxScroll) {
      ref.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      ref.scrollBy({ left: width / 2, behavior: "smooth" });
    }
  };

  const [canScroll, setCanScroll] = useState({});

  const updateScrollButtons = (catId) => {
    const ref = scrollRefMap.current[catId];
    if (!ref) return;
    setCanScroll((prev) => ({
      ...prev,
      [catId]: {
        left: ref.scrollLeft > 0,
        right: ref.scrollLeft < ref.scrollWidth - ref.offsetWidth,
      },
    }));
  };

  useEffect(() => {
    const observers = [];
    categorias.forEach((cat) => {
      const ref = scrollRefMap.current[cat.id];
      if (ref) {
        const onScroll = () => updateScrollButtons(cat.id);
        ref.addEventListener("scroll", onScroll);
        observers.push(() => ref.removeEventListener("scroll", onScroll));
        updateScrollButtons(cat.id);
      }
    });
    return () => observers.forEach((unsub) => unsub());
  }, [categorias, produtosPorCategoria]);

 
  return (
    <main className="bg-[#ECFFEB]">
      <Navbar />

      {/* BOTÕES DE CATEGORIA */}
      <motion.section
        className="py-10 px-4 max-w-6xl mx-auto flex flex-wrap justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {categorias.map((cat) => {
          const Icon =
            cat.nome_cat === "Cães"
              ? Dog
              : cat.nome_cat === "Gatos"
              ? Cat
              : cat.nome_cat === "Peixes"
              ? Fish
              : cat.nome_cat === "Outros Pets"
              ? Box
              : cat.nome_cat === "Casa & Jardim"
              ? HomeIcon
              : null;

          return (
            <div
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className="flex items-center gap-3 px-6 py-4 bg-white text-green-700 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition text-lg justify-center cursor-pointer min-w-[140px]"
            >
              {Icon && <Icon size={24} />}
              <span className="truncate">{cat.nome_cat}</span>
            </div>
          );
        })}
      </motion.section>

      {/* CARROSSEL PRINCIPAL */}
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
              style={{ transform: `translateX(${(index - currentBanner) * 100}%)` }}
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

          {banners.length > 1 && (
            <>
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
            </>
          )}
        </div>
      </section>

      {/* CARROSSEIS DE CATEGORIAS */}
      <div className="max-w-6xl mx-auto mt-10 space-y-14">
        {categorias.map((cat) => (
          <div key={cat.id} ref={(el) => (categoriaRefs.current[cat.id] = el)}>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6">{cat.nome_cat}</h2>
            <div className="relative">
              <button
                onClick={() => scrollLeft(cat.id)}
                disabled={!canScroll[cat.id]?.left}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition ${
                  canScroll[cat.id]?.left
                    ? "bg-black/50 text-white hover:bg-black/70"
                    : "bg-black/20 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ChevronLeft size={28} />
              </button>

              <div
                ref={(el) => (scrollRefMap.current[cat.id] = el)}
                className="flex overflow-x-auto gap-4 scroll-smooth"
                style={{ overflowY: "hidden" }}
              >
                {(produtosPorCategoria[cat.id] || []).map((p) => (
                  <motion.div
                    key={p.id_prod}
                    className="min-w-[220px] bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-xl transition"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Link href={`/produto/${p.id_prod}`} className="flex flex-col items-center w-full">
                      <div className="relative w-40 h-40 mb-3">
                        <Image
                          src={p.imagenResolved || "/placeholder.png"}
                          alt={p.nome}
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <span className="mt-1 font-medium text-gray-700 text-center truncate w-full">
                        {p.nome}
                      </span>
                      <p className="text-lg font-bold text-green-700 mt-2">
                        R$ {p.valor_venda?.toFixed(2)}
                      </p>
                    </Link>
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="mt-3 flex items-center justify-center bg-green-700 hover:bg-green-800 text-white rounded-full py-2 px-4 font-semibold transition-all transform hover:scale-105"
                    >
                      <Plus size={18} className="mr-2" /> Adicionar
                    </button>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => scrollRight(cat.id)}
                disabled={!canScroll[cat.id]?.right}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition ${
                  canScroll[cat.id]?.right
                    ? "bg-black/50 text-white hover:bg-black/70"
                    : "bg-black/20 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Rodape />
    </main>
  );
}

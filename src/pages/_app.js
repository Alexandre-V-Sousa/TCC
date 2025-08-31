import "@/styles/globals.css";
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
  const banners = [
    { src: "/banner1.png", alt: "Promoção especial" },
    { src: "/banner2.png", alt: "Novidades na loja" },
  ];

  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const viewportRef = useRef(null);
  const slideInnerRefs = useRef([]);
  const rafRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef({ x: 0, y: 0 });
  const touchStartX = useRef(null);

  // --- Carrossel Banner ---
  useEffect(() => {
    startAutoplay();
    return () => {
      stopAutoplay();
      cancelRaf();
    };
  }, [banners.length]);

  const startAutoplay = () => {
    stopAutoplay();
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % banners.length);
    }, 4000);
  };
  const stopAutoplay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  const cancelRaf = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };
  const runRaf = () => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(step);
  };
  const step = () => {
    const k = 0.12;
    currentPosRef.current.x += (targetRef.current.x - currentPosRef.current.x) * k;
    currentPosRef.current.y += (targetRef.current.y - currentPosRef.current.y) * k;

    const el = slideInnerRefs.current[current];
    if (el) el.style.transform = `translate3d(${currentPosRef.current.x}px, ${currentPosRef.current.y}px, 0) scale(1.03)`;

    const dx = Math.abs(targetRef.current.x - currentPosRef.current.x);
    const dy = Math.abs(targetRef.current.y - currentPosRef.current.y);
    if (dx > 0.1 || dy > 0.1) rafRef.current = requestAnimationFrame(step);
    else rafRef.current = null;
  };
  const handleMouseMove = (e) => {
    const vp = viewportRef.current;
    if (!vp) return;
    const rect = vp.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    const maxX = Math.min(50, rect.width * 0.05);
    const maxY = Math.min(25, rect.height * 0.03);
    targetRef.current.x = relX * maxX;
    targetRef.current.y = relY * maxY;
    runRaf();
  };
  const handleMouseLeave = () => {
    targetRef.current.x = 0;
    targetRef.current.y = 0;
    runRaf();
  };
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) goNext();
    else if (diff < -50) goPrev();
    touchStartX.current = null;
  };
  const goNext = () => {
    setCurrent((p) => (p + 1) % banners.length);
    resetParallax();
    restartAutoplay();
  };
  const goPrev = () => {
    setCurrent((p) => (p - 1 + banners.length) % banners.length);
    resetParallax();
    restartAutoplay();
  };
  const resetParallax = () => {
    slideInnerRefs.current.forEach((el) => el && (el.style.transform = "translate3d(0,0,0) scale(1)"));
    targetRef.current = { x: 0, y: 0 };
    currentPosRef.current = { x: 0, y: 0 };
    cancelRaf();
  };
  const restartAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };
  useEffect(() => {
    slideInnerRefs.current.forEach((el, idx) => {
      if (!el) return;
      el.style.transition = idx === current ? "transform 350ms ease" : "none";
      el.style.transform = "translate3d(0,0,0) scale(1)";
    });
    const t = setTimeout(() => {
      slideInnerRefs.current.forEach((el) => el && (el.style.transition = ""));
    }, 350);
    return () => clearTimeout(t);
  }, [current]);

  // --- Produtos ---
  const dogProducts = [
    { name: "Ração", img: "/RaçãoCachorro.jpg" },
    { name: "Petisco", img: "/PetiscoCachorro.jpg" },
    { name: "Osso", img: "/OssoCachorro.jpg" },
    { name: "Higiene", img: "/HigieneCachorro.jpg" },
    { name: "Coleiras", img: "/ColeirasCachorro.jpg" },
    { name: "Brinquedos", img: "/BrinquedosCachorro.jpg" },
  ];
  const catProducts = [
    { name: "Ração", img: "/produtos/gato/racao.jpg" },
    { name: "Petisco", img: "/produtos/gato/petisco.jpg" },
    { name: "Arranhador", img: "/produtos/gato/arranhador.jpg" },
    { name: "Higiene", img: "/produtos/gato/higiene.jpg" },
    { name: "Brinquedos", img: "/produtos/gato/brinquedos.jpg" },
  ];

  // --- Scroll refs ---
  const scrollRefDog = useRef(null);
  const scrollRefCat = useRef(null);
  const scrollLeft = (ref) => ref.current?.scrollBy({ left: -320, behavior: "smooth" });
  const scrollRight = (ref) => ref.current?.scrollBy({ left: 320, behavior: "smooth" });

  return (
    <main className="bg-[#ECFFEB]">
      {/* Navbar */}
      <nav className="bg-[#ECFFEB] shadow">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="flex items-center space-x-4 md:space-x-6">
            <Image src="/logo.png" alt="Logo" width={80} height={80} className="rounded-full" />
            <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-5 text-black">
              <li><Link href="/">Início</Link></li>
              <li><Link href="/produtos">Produtos</Link></li>
              <li><Link href="/animais">Animais</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-auto text-center md:text-left relative">
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="border border-gray-300 rounded-full px-12 py-4 w-full md:max-w-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md text-black"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z" />
            </svg>
          </div>
          <div className="flex items-center space-x-4 text-black">
            <Link href="/login"><User size={28} /></Link>
            <Link href="/carrinho"><ShoppingCart size={28} /></Link>
            <Link href="/contato"><Mail size={28} /></Link>
          </div>
        </div>
      </nav>

      {/* Benefícios */}
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
          <span className="text-gray-700 font-semibold">Formas de Pagamento</span>
        </div>
      </section>

      {/* Carrossel Principal */}
      <section className="relative mt-6 w-full">
        <div
          ref={viewportRef}
          className="relative overflow-hidden group h-56 sm:h-72 md:h-[400px] lg:h-[500px] w-full"
          onMouseEnter={stopAutoplay}
          onMouseLeave={() => { startAutoplay(); handleMouseLeave(); }}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {banners.map((b, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
            >
              <div ref={(el) => (slideInnerRefs.current[i] = el)} className="absolute inset-0 will-change-transform">
                <Image src={b.src} alt={b.alt} fill style={{ objectFit: "cover" }} sizes="100vw" priority={i === 0} />
              </div>
            </div>
          ))}
          <button onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full z-10 hover:bg-black/70 transition">
            <ChevronLeft size={28} />
          </button>
          <button onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full z-10 hover:bg-black/70 transition">
            <ChevronRight size={28} />
          </button>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-10 px-4 max-w-6xl mx-auto flex flex-wrap justify-center gap-4">
        <Link href="/animais/cachorro" className="flex items-center gap-3 px-6 py-4 bg-white text-green-700 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition text-lg justify-center"><Dog size={24} /> Cachorro</Link>
        <Link href="/animais/gato" className="flex items-center gap-3 px-6 py-4 bg-white text-green-700 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition text-lg justify-center"><Cat size={24} /> Gato</Link>
        <Link href="/animais/peixe" className="flex items-center gap-3 px-6 py-4 bg-white text-green-700 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition text-lg justify-center"><Fish size={24} /> Peixe</Link>
        <Link href="/animais/outros" className="flex items-center gap-3 px-6 py-4 bg-white text-green-700 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition text-lg justify-center"><Box size={24} /> Outros Pets</Link>
        <Link href="/casa-e-jardim" className="flex items-center gap-3 px-6 py-4 bg-white text-green-700 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition text-lg justify-center"><HomeIcon size={24} /> Casa & Jardim</Link>
      </section>

      {/* Carrossel Cachorro */}
      <section className="py-10 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6">Produtos para Cachorro </h2>
        <div className="relative">
          <button onClick={() => scrollLeft(scrollRefDog)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"><ChevronLeft size={28} /></button>
          <div ref={scrollRefDog} className="flex overflow-x-auto gap-4 scrollbar-hide scroll-smooth">
            {dogProducts.map((p, i) => (
              <motion.div key={i} className="min-w-[220px] bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform" whileHover={{ scale: 1.08 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Image src={p.img} alt={p.name} width={200} height={140} className="rounded-lg" />
                <span className="mt-2 font-semibold text-green-700">{p.name}</span>
              </motion.div>
            ))}
          </div>
          <button onClick={() => scrollRight(scrollRefDog)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"><ChevronRight size={28} /></button>
        </div>
      </section>

      {/* Carrossel Gato */}
      <section className="py-10 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6">Produtos para Gato </h2>
        <div className="relative">
          <button onClick={() => scrollLeft(scrollRefCat)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"><ChevronLeft size={28} /></button>
          <div ref={scrollRefCat} className="flex overflow-x-auto gap-4 scrollbar-hide scroll-smooth">
            {catProducts.map((p, i) => (
              <motion.div key={i} className="min-w-[220px] bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform" whileHover={{ scale: 1.08 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Image src={p.img} alt={p.name} width={200} height={140} className="rounded-lg" />
                <span className="mt-2 font-semibold text-green-700">{p.name}</span>
              </motion.div>
            ))}
          </div>
          <button onClick={() => scrollRight(scrollRefCat)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"><ChevronRight size={28} /></button>
        </div>
      </section>
    </main>
  );
}

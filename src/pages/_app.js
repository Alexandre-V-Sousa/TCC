import "@/styles/globals.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, User, ShoppingCart, Mail, Dog, Cat, Fish, Box, Home as HomeIcon } from "lucide-react";

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
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(step);
    }
  };

  const step = () => {
    const k = 0.12;
    currentPosRef.current.x += (targetRef.current.x - currentPosRef.current.x) * k;
    currentPosRef.current.y += (targetRef.current.y - currentPosRef.current.y) * k;

    const el = slideInnerRefs.current[current];
    if (el) {
      el.style.transform = `translate3d(${currentPosRef.current.x}px, ${currentPosRef.current.y}px, 0) scale(1.03)`;
    }

    const dx = Math.abs(targetRef.current.x - currentPosRef.current.x);
    const dy = Math.abs(targetRef.current.y - currentPosRef.current.y);
    if (dx > 0.1 || dy > 0.1) {
      rafRef.current = requestAnimationFrame(step);
    } else {
      rafRef.current = null;
    }
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

  const goTo = (i) => {
    setCurrent(i);
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

  return (
    <main className="bg-[#ECFFEB]">
      {/* Navegação */}
      <nav className="bg-[#ECFFEB] shadow">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Image src="/logo.png" alt="Logo" width={80} height={80} className="rounded-full" />
            <ul className="flex space-x-5">
              <li><Link href="/" className="text-black hover:underline">Início</Link></li>
              <li><Link href="/produtos" className="text-black hover:underline">Produtos</Link></li>
              <li><Link href="/animais" className="text-black hover:underline">Animais</Link></li>
            </ul>
          </div>
          <div className="text-center text-black">
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="border border-gray-300 rounded-full px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-black hover:text-green-700 transition">
              <User size={28} />
            </Link>
            <Link href="/carrinho" className="text-black hover:text-green-700 transition">
              <ShoppingCart size={28} />
            </Link>
            <Link href="/contato" className="text-black hover:text-green-700 transition">
              <Mail size={28} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Carrossel Full Width */}
      <section className="relative mt-6 w-full">
        <div
          ref={viewportRef}
          className="relative overflow-hidden group h-72 md:h-[500px] w-full"
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
              aria-hidden={i === current ? "false" : "true"}
            >
              <div
                ref={(el) => (slideInnerRefs.current[i] = el)}
                className="absolute inset-0 will-change-transform"
                style={{ transform: "translate3d(0,0,0) scale(1)" }}
              >
                <Image src={b.src} alt={b.alt} fill style={{ objectFit: "cover" }} sizes="100vw" priority={i === 0} />
              </div>
            </div>
          ))}

          {/* Setas Lucide */}
          <button
            type="button"
            aria-label="Anterior"
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            type="button"
            aria-label="Próximo"
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronRight size={32} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {banners.map((_, i) => (
              <button
                key={i}
                aria-label={`Ir para slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={`w-3 h-3 rounded-full ${i === current ? "bg-white" : "bg-gray-400"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Lista de Categorias com Ícones */}
      <section className="py-10 px-4 max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/animais/cachorro" className="flex items-center gap-2 px-5 py-2 bg-white text-green-700 rounded-full font-semibold shadow hover:shadow-lg transition">
            <Dog size={20} /> Cachorro
          </Link>
          <Link href="/animais/peixe" className="flex items-center gap-2 px-5 py-2 bg-white text-green-700 rounded-full font-semibold shadow hover:shadow-lg transition">
            <Fish size={20} /> Peixe
          </Link>
          <Link href="/animais/gato" className="flex items-center gap-2 px-5 py-2 bg-white text-green-700 rounded-full font-semibold shadow hover:shadow-lg transition">
            <Cat size={20} /> Gato
          </Link>
          <Link href="/animais/outros" className="flex items-center gap-2 px-5 py-2 bg-white text-green-700 rounded-full font-semibold shadow hover:shadow-lg transition">
            <Box size={20} /> Outros Pets
          </Link>
          <Link href="/casa-e-jardim" className="flex items-center gap-2 px-5 py-2 bg-white text-green-700 rounded-full font-semibold shadow hover:shadow-lg transition">
            <HomeIcon size={20} /> Casa & Jardim
          </Link>
        </div>
      </section>

      {/* Destaques */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-green-800 text-center mb-10">Nossos Destaques 🌟</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition">
            <Image src="/racao.jpg" alt="Ração de qualidade" width={300} height={200} className="rounded-lg mx-auto" />
            <h3 className="text-xl font-semibold mt-4">Rações Premium</h3>
            <p className="text-gray-600">Nutrição de qualidade para seu rebanho.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition">
            <Image src="/sementes.jpg" alt="Sementes selecionadas" width={300} height={200} className="rounded-lg mx-auto" />
            <h3 className="text-xl font-semibold mt-4">Sementes Selecionadas</h3>
            <p className="text-gray-600">Alta produtividade para sua lavoura.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition">
            <Image src="/ferramentas.jpg" alt="Ferramentas agrícolas" width={300} height={200} className="rounded-lg mx-auto" />
            <h3 className="text-xl font-semibold mt-4">Ferramentas</h3>
            <p className="text-gray-600">Tudo que você precisa no dia a dia.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-700 text-white py-12 text-center">
        <h2 className="text-3xl font-bold">Pronto para comprar? 🛒</h2>
        <p className="mt-3 text-lg">Confira nossa lista completa de produtos!</p>
        <Link href="/produtos" className="mt-6 inline-block px-8 py-3 bg-white text-green-700 font-semibold rounded-xl shadow hover:bg-gray-100 transition">
          Ir para Loja
        </Link>
      </section>

      <footer className="py-12 text-center">
        <p className="text-gray-600">&copy; 2023 Agropecuária Patrícia. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}

// pages/index.js
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Dog, Cat, Fish, Box, Home } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

  useEffect(() => { startAutoplay(); return () => { stopAutoplay(); cancelRaf(); }; }, [banners.length]);

  const startAutoplay = () => { stopAutoplay(); timerRef.current = setInterval(() => setCurrent((p) => (p + 1) % banners.length), 4000); };
  const stopAutoplay = () => { if(timerRef.current){ clearInterval(timerRef.current); timerRef.current = null; }};
  const cancelRaf = () => { if(rafRef.current){ cancelAnimationFrame(rafRef.current); rafRef.current = null; }};
  const runRaf = () => { if(!rafRef.current){ rafRef.current = requestAnimationFrame(step); }};
  const step = () => {
    const k = 0.12;
    currentPosRef.current.x += (targetRef.current.x - currentPosRef.current.x) * k;
    currentPosRef.current.y += (targetRef.current.y - currentPosRef.current.y) * k;
    const el = slideInnerRefs.current[current];
    if(el){ el.style.transform = `translate3d(${currentPosRef.current.x}px, ${currentPosRef.current.y}px,0) scale(1.03)`; }
    const dx = Math.abs(targetRef.current.x - currentPosRef.current.x);
    const dy = Math.abs(targetRef.current.y - currentPosRef.current.y);
    if(dx>0.1 || dy>0.1){ rafRef.current = requestAnimationFrame(step); } else { rafRef.current = null; }
  };

  const handleMouseMove = (e) => {
    const vp = viewportRef.current; if(!vp) return;
    const rect = vp.getBoundingClientRect();
    const relX = (e.clientX - rect.left)/rect.width - 0.5;
    const relY = (e.clientY - rect.top)/rect.height - 0.5;
    const maxX = Math.min(50, rect.width*0.05);
    const maxY = Math.min(25, rect.height*0.03);
    targetRef.current.x = relX*maxX;
    targetRef.current.y = relY*maxY;
    runRaf();
  };
  const handleMouseLeave = () => { targetRef.current.x = 0; targetRef.current.y = 0; runRaf(); };
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => { if(touchStartX.current===null) return; const diff = touchStartX.current - e.changedTouches[0].clientX; if(diff>50) goNext(); else if(diff<-50) goPrev(); touchStartX.current=null; };
  const goNext = () => { setCurrent((p) => (p + 1) % banners.length); resetParallax(); restartAutoplay(); };
  const goPrev = () => { setCurrent((p) => (p - 1 + banners.length) % banners.length); resetParallax(); restartAutoplay(); };
  const goTo = (i) => { setCurrent(i); resetParallax(); restartAutoplay(); };
  const resetParallax = () => { slideInnerRefs.current.forEach((el) => el && (el.style.transform="translate3d(0,0,0) scale(1)")); targetRef.current={x:0,y:0}; currentPosRef.current={x:0,y:0}; cancelRaf(); };
  const restartAutoplay = () => { stopAutoplay(); startAutoplay(); };

  useEffect(() => {
    slideInnerRefs.current.forEach((el, idx) => {
      if(!el) return;
      el.style.transition = idx===current ? "transform 350ms ease" : "none";
      el.style.transform = "translate3d(0,0,0) scale(1)";
    });
    const t = setTimeout(() => { slideInnerRefs.current.forEach((el) => el && (el.style.transition="")); },350);
    return ()=>clearTimeout(t);
  },[current]);

  return (
    <main>
      {/* Carrossel */}
      <section className="relative mt-6 w-full">
        <div ref={viewportRef} className="relative overflow-hidden group h-72 md:h-[500px] w-full"
          onMouseEnter={stopAutoplay} onMouseLeave={()=>{startAutoplay();handleMouseLeave();}}
          onMouseMove={handleMouseMove} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          {banners.map((b,i)=>(
            <div key={i} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i===current?"opacity-100 z-10":"opacity-0 z-0 pointer-events-none"}`} aria-hidden={i===current?"false":"true"}>
              <div ref={el=>(slideInnerRefs.current[i]=el)} className="absolute inset-0 will-change-transform" style={{transform:"translate3d(0,0,0) scale(1)"}}>
                <Image src={b.src} alt={b.alt} fill style={{objectFit:"cover"}} sizes="100vw" priority={i===0}/>
              </div>
            </div>
          ))}

          {/* Setas */}
          <button type="button" aria-label="Anterior" onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
            <ChevronLeft size={32}/>
          </button>
          <button type="button" aria-label="Próximo" onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
            <ChevronRight size={32}/>
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {banners.map((_,i)=>(
              <button key={i} aria-label={`Ir para slide ${i+1}`} onClick={()=>goTo(i)} className={`w-3 h-3 rounded-full ${i===current?"bg-white":"bg-gray-400"}`}/>
            ))}
          </div>
        </div>
      </section>

      {/* Botões de animais */}
      <section className="py-10 px-4 max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/animais/todos" className="flex items-center gap-2 px-5 py-2 bg-white text-green-700 rounded-full font-semibold shadow hover:shadow-lg transition">
            <Box size={20}/> Todos
          </Link>
          <Link href="/animais/cachorro" className="flex items-center gap-2 px-5 py-2 bg-white text-green-700 rounded-full font-semibold shadow hover:shadow-lg transition">
            <Dog size={20}/> Cachorro
          </Link>
          <Link href="/animais/gato" className="flex items-center gap-2 px-5 py-2 bg-white text-green-700 rounded-full font-semibold shadow hover:shadow-lg transition">
            <Cat size={20}/> Gato
          </Link>
          <Link href="/animais/peixe" className="flex items-center gap-2 px-5 py-2 bg-white text-green-700 rounded-full font-semibold shadow hover:shadow-lg transition">
            <Fish size={20}/> Peixe
          </Link>
          <Link href="/casa-e-jardim" className="flex items-center gap-2 px-5 py-2 bg-white text-green-700 rounded-full font-semibold shadow hover:shadow-lg transition">
            <Home size={20}/> Casa & Jardim
          </Link>
        </div>
      </section>
    </main>
  );
}

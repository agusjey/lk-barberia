import Link from "next/link";
import StrokeText from "./StrokeText";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] bg-black text-white flex flex-col items-center justify-center text-center px-4 pt-20 overflow-hidden">
      {/* GLOW DE FONDO */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[500px] md:h-[500px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 space-y-6 max-w-3xl mx-auto flex flex-col items-center">
        
        {/* BADGE FLOTANTE */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/80 border border-yellow-500/30 text-yellow-400 text-xs md:text-sm font-medium tracking-wide shadow-inner backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
          LA MEJOR BARBERÍA DE SAN SALVADOR
        </div>

        {/* TÍTULO PRINCIPAL (TAMAÑO ORIGINAL) */}
        <StrokeText
          text="LKBarber"
          strokeColor="#FACC15"
          fillColor="#FEF08A"
          strokeWidth={1.6}
          fontSize={80}
          fontWeight={800}
          letterSpacing={-2}
        />

        {/* SUBTÍTULO */}
        <p className="text-gray-400 text-base md:text-xl font-light max-w-lg leading-relaxed">
          Cortes urbanos, perfilados clásicos y atención de primer nivel. Tu estilo comienza acá.
        </p>

        {/* BOTÓN Y MÉTRICAS */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#reservar"
            className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold text-lg px-8 py-4 rounded-xl hover:from-yellow-400 hover:to-yellow-300 transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-yellow-500/20 cursor-pointer"
          >
            Reservar Turno
          </a>
        </div>

        {/* TARJETAS DE MÉTRICAS MÁS CHICAS Y COMPACTAS */}
        <div className="grid grid-cols-3 gap-3 pt-8 w-full max-w-sm">
          
          <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
            <p className="text-lg md:text-xl font-bold text-white">100%</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Calidad</p>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
            <p className="text-lg md:text-xl font-bold text-yellow-400">San Sal.</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Ubicación</p>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
            <p className="text-lg md:text-xl font-bold text-white">Online</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Reservas</p>
          </div>

        </div>

      </div>
    </section>
  );
}
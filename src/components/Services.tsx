"use client";

const services = [
  {
    icon: "✂️",
    title: "Corte Tradicional / Urbano",
    description: "Asesoramiento de imagen, degrades (fade), perfilado de contornos y peinado con producto.",
    price: "$$$",
  },
  {
    icon: "🪒",
    title: "Barba & Perfilado",
    description: "Diseño de barba, rebajado, perfilado a navaja tradicional y toalla caliente para hidratación.",
    price: "$$$",
  },
  {
    icon: "🔥",
    title: "Combo Completo (Corte + Barba)",
    description: "Servicio premium integral. Cambio de look completo con los mejores cuidados para tu piel y cabello.",
    price: "$$$",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="py-20 bg-black text-white px-4 border-t border-neutral-900">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* ENCABEZADO */}
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-yellow-500">
            Nuestros Servicios
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-wide">
            Especialidades de la Casa
          </h2>
          <div className="w-12 h-1 bg-yellow-500 mx-auto rounded-full" />
        </div>

        {/* GRILLA DE SERVICIOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((item, index) => (
            <div
              key={index}
              className="group relative bg-neutral-950 border border-neutral-800/80 rounded-2xl p-6 hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-yellow-500/5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 group-hover:border-yellow-500/40 transition duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-yellow-500 transition">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-900 flex justify-between items-center">
                <span className="text-xs text-gray-500 font-medium">Servicio Profesional</span>
                <a
                  href="#reservar"
                  className="text-xs font-bold text-yellow-500 group-hover:translate-x-1 transition flex items-center gap-1"
                >
                  Reservar →
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
"use client";

const services = [
  {
    category: "Corte",
    title: "Corte Tradicional / Urbano",
    description: "Asesoramiento de imagen, degrades (fade), perfilado de contornos y peinado con producto de alta fijación.",
    price: "$17.000",
  },
  {
    category: "Barba",
    title: "Barba & Perfilado",
    description: "Diseño de barba, rebajado, perfilado a navaja tradicional y toalla caliente para hidratación y relax.",
    price: "$7.000",
  },
  {
    category: "Combo Destacado",
    title: "Combo Completo (Corte + Barba)",
    description: "Servicio premium integral. Cambio de look completo con los mejores cuidados para tu piel y cabello.",
    price: "$22.000",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="py-24 bg-black text-white px-4 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* ENCABEZADO */}
        <div className="text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-yellow-500">
            // Experiencia y Estilo
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
            Nuestros Servicios
          </h2>
          <div className="w-16 h-0.5 bg-yellow-500 mx-auto" />
        </div>

        {/* GRILLA DE SERVICIOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((item, index) => (
            <div
              key={index}
              className="group relative bg-[#0a0a0a] border border-neutral-800/80 rounded-2xl p-8 hover:border-yellow-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* ETIQUETA Y DURACIÓN */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded">
                    {item.category}
                  </span>
                </div>

                {/* TÍTULO Y DESCRIPCIÓN */}
                <div className="space-y-3 mb-8">
                  <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* PRECIO (SIN BOTÓN) */}
              <div className="pt-6 border-t border-neutral-900 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 block">Precio</span>
                  <span className="text-2xl font-black text-white tracking-tight">
                    {item.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
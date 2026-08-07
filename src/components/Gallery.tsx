const galleryItems = [
  { id: 1, label: "Fade Clásico" },
  { id: 2, label: "Perfilado de Barba" },
  { id: 3, label: "Texturado Moderno" },
  { id: 4, label: "Corte Diseñado" },
];

export default function Gallery() {
  return (
    <section id="galeria" className="py-20 bg-black text-white px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-yellow-500 tracking-wide uppercase">
          Galería de Cortes
        </h2>
        <p className="mt-2 text-gray-400">Trabajos reales realizados en nuestro sillón.</p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="aspect-square bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center p-4 hover:border-yellow-500/50 transition group cursor-pointer"
            >
              <span className="text-gray-500 group-hover:text-yellow-500 font-medium transition text-center">
                📷 {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-md border-b border-neutral-900 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* TEXTO LIMPIO SIN LOGO */}
        <Link href="/" className="font-bold text-xl tracking-wider text-yellow-500">
          LKBARBER
        </Link>

        {/* MENÚ Y BOTÓN RESERVAR */}
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-6 text-sm text-gray-300">
            <Link href="#servicios" className="hover:text-yellow-500 transition">
              Servicios
            </Link>
            <Link href="#galeria" className="hover:text-yellow-500 transition">
              Galería
            </Link>
            <Link href="#contacto" className="hover:text-yellow-500 transition">
              Contacto
            </Link>
          </div>

          <Link
            href="#reservar"
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition"
          >
            Reservar
          </Link>
        </div>

      </div>
    </nav>
  );
}
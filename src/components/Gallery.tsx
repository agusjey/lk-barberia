"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

const galleryItems = [
  { 
    id: 1, 
    label: "Fade Clásico", 
    image: "/fade-clasico.png" 
  },
  { 
    id: 2, 
    label: "Texturado Moderno", 
    image: "/texturado-moderno.png" 
  },
  { 
    id: 3, 
    label: "Corte Diseñado", 
    image: "/corte-diseño.png" 
  },
];

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    gsap.fromTo(
      el.children,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <section id="galeria" className="py-24 bg-black text-white px-4">
      <div className="max-w-5xl mx-auto text-center">
        
        <h2 className="text-3xl md:text-5xl font-extrabold text-yellow-400 tracking-wide uppercase">
          Galería de Cortes
        </h2>
        <p className="mt-3 text-gray-400 text-base md:text-lg">
          Trabajos reales realizados en nuestro sillón.
        </p>

        <div 
          ref={containerRef}
          className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 group cursor-pointer shadow-lg hover:border-yellow-400/80 transition-all duration-300"
            >
              <Image
                src={item.image}
                alt={item.label}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />

              <div className="absolute bottom-0 inset-x-0 p-5 text-center transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300 z-10">
                <span className="inline-block px-3.5 py-1.5 bg-black/70 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase text-yellow-400 border border-yellow-500/40 shadow-md">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
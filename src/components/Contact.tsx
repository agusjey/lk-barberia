"use client";

import React from "react";
import SpecularButton from "./SpecularButton";

export default function ContactSection() {
  return (
    <section id="contacto" className="py-24 bg-black text-white px-4 relative overflow-hidden">
      {/* Resplandor de fondo ambiental futurista */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-wider uppercase bg-gradient-to-r from-white via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
            Canales Oficiales
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* BOTÓN DE INSTAGRAM - FUTURISTA */}
          <SpecularButton
            size="lg"
            radius={16}
            tint="#06b6d4"
            tintOpacity={0.15}
            blur={15}
            textColor="#ffffff"
            lineColor="#22d3ee"
            baseColor="#0a0a0c"
            intensity={1.2}
            shineSize={15}
            shineFade={50}
            thickness={1}
            speed={0.35}
            followMouse={true}
            proximity={300}
            autoAnimate={false}
            onClick={() => window.open("https://instagram.com/lkbarber_ss", "_blank")}
          >
            <div className="flex items-center justify-between w-full py-3 px-2 h-full group">
              <div className="flex items-center gap-4">
                {/* Icono con borde láser cian */}
                <div className="flex-shrink-0 w-12 h-12 p-3 bg-neutral-950/80 border border-cyan-500/30 rounded-xl text-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:border-cyan-400 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </div>
                <div className="text-left flex flex-col justify-center">
                  <h4 className="font-bold text-base text-white tracking-wide m-0 leading-tight">Instagram</h4>
                  <p className="text-xs text-cyan-400/80 font-mono m-0 leading-tight mt-1">@lkbarber_ss</p>
                </div>
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 group-hover:text-cyan-400 transition-colors pr-2">
                Seguir [↗]
              </span>
            </div>
          </SpecularButton>

          {/* BOTÓN DE WHATSAPP - FUTURISTA */}
          <SpecularButton
            size="lg"
            radius={16}
            tint="#10b981"
            tintOpacity={0.15}
            blur={15}
            textColor="#ffffff"
            lineColor="#34d399"
            baseColor="#0a0a0c"
            intensity={1.2}
            shineSize={15}
            shineFade={50}
            thickness={1}
            speed={0.35}
            followMouse={true}
            proximity={300}
            autoAnimate={false}
            onClick={() => window.open("https://wa.me/", "_blank")}
          >
            <div className="flex items-center justify-between w-full py-3 px-2 h-full group">
              <div className="flex items-center gap-4">
                {/* Icono con borde láser esmeralda */}
                <div className="flex-shrink-0 w-12 h-12 p-3 bg-neutral-950/80 border border-emerald-500/30 rounded-xl text-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:border-emerald-400 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                </div>
                <div className="text-left flex flex-col justify-center">
                  <h4 className="font-bold text-base text-white tracking-wide m-0 leading-tight">WhatsApp</h4>
                  <p className="text-xs text-emerald-400/80 font-mono m-0 leading-tight mt-1">Enviar mensaje</p>
                </div>
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 group-hover:text-emerald-400 transition-colors pr-2">
                Chatear [↗]
              </span>
            </div>
          </SpecularButton>

        </div>
      </div>
    </section>
  );
}
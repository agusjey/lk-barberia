/** @type {import('next').NextOptions} */
const nextConfig = {
  async headers() {
    return [
      {
        // Aplica estas cabeceras a todas las rutas de tu web
        source: "/:path*",
        headers: [
          // 1. Evita que tu web sea cargada en iframes externos (Soluciona X-Frame-Options)
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // 2. Evita que el navegador adivine el tipo de archivo (MIME-sniffing) (Soluciona X-Content-Type-Options)
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // 3. Controla qué información de referidos se envía en los enlaces (Soluciona Referrer Policy)
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // 4. Política de seguridad de contenido básica recomendada (Soluciona CSP)
          {
            key: "Content-Security-Policy",
            value: "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

/**
 * Script de Animación de Red con Parallax - PC Puma
 * Versión optimizada: inicialización responsiva, IntersectionObserver y nodos celeste/dorado premium.
 */

window.addEventListener('load', () => {

  const initNetworkAnimation = (canvasId, particleColor, lineColorPrefix, accentColor) => {

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrameId;
    let isVisible = true;

    // Configuración de la red
    const config = {
      particleCount: 80,
      maxDistance: 150,
      speed: 0.35,
      particleColor: particleColor || 'rgba(0, 210, 255, 0.7)',
      lineColorPrefix: lineColorPrefix || 'rgba(0, 200, 255, ',
      accentColor: accentColor || 'rgba(255, 215, 0, 0.8)'
    };

    const maxDistanceSq = config.maxDistance * config.maxDistance;

    // 🔹 Crear partículas
    function createParticles() {
      particles = [];

      for (let i = 0; i < config.particleCount; i++) {
        const z = Math.random() * 2.0 + 0.5; // Profundidad virtual (efecto 3D)
        const isAccent = Math.random() > 0.85; // 15% de partículas doradas

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * config.speed,
          vy: (Math.random() - 0.5) * config.speed,
          z,
          color: isAccent ? config.accentColor : config.particleColor,
          radius: (isAccent ? 1.8 : 1.2) + Math.random() * 1.2
        });
      }
    }

    // 🔹 Ajustar tamaño correctamente
    function updateSize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = canvas.offsetWidth;
      height = canvas.offsetHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Adaptar el número de partículas responsivamente
      if (width < 768) {
        config.particleCount = 28; // Móviles
      } else if (width < 1200) {
        config.particleCount = 50; // Tablets
      } else {
        config.particleCount = 80; // Escritorios
      }

      createParticles(); // 🔥 CLAVE: regenerar partículas
    }

    // 🔹 Animación principal
    function animate() {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(animate);

      ctx.clearRect(0, 0, width, height);

      // Movimiento
      for (let p of particles) {
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      // Conexiones
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {

          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistanceSq) {

            const avgZ = (p1.z + p2.z) / 2;
            const alpha = (1 - distSq / maxDistanceSq) * (avgZ / 2.5) * 0.45;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Si una de las partículas es dorada, la línea tiene un toque dorado
            if (p1.color === config.accentColor || p2.color === config.accentColor) {
              ctx.strokeStyle = `rgba(255, 215, 0, ${alpha * 1.2})`;
            } else {
              ctx.strokeStyle = `${config.lineColorPrefix}${alpha})`;
            }
            
            ctx.lineWidth = 0.5 * avgZ;
            ctx.stroke();
          }
        }
      }

      // Dibujar partículas (nodos)
      for (let p of particles) {
        const size = p.radius * p.z;

        // Nodo base
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Brillo concéntrico optimizado (en lugar de shadowBlur)
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * (p.color === config.accentColor ? 2.5 : 1.8), 0, Math.PI * 2);
        const glowColor = p.color.replace(/[\d.]+\)$/, '0.12)');
        ctx.fillStyle = glowColor;
        ctx.fill();
      }
    }

    // 🔹 Pausar cuando el tab está oculto
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        isVisible = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        isVisible = true;
        animate();
      }
    });

    // 🔹 Pausar cuando no está visible en pantalla (IntersectionObserver)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          animate();
        } else {
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
        }
      });
    }, { threshold: 0.05 });

    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    // 🔹 Inicialización correcta
    updateSize();
    animate();

    window.addEventListener('resize', updateSize);
  };

  // Inicializar ambos canvas con la animación de nodos celeste y oro premium (Idéntico al Hero)
  initNetworkAnimation(
    'serviciosCanvas',
    'rgba(0, 210, 255, 0.7)',
    'rgba(0, 200, 255, ',
    'rgba(255, 215, 0, 0.8)'
  );

  initNetworkAnimation(
    'networkCanvas',
    'rgba(0, 210, 255, 0.7)',
    'rgba(0, 200, 255, ',
    'rgba(255, 215, 0, 0.8)'
  );

  initNetworkAnimation(
    'prestamosCanvas',
    'rgba(0, 210, 255, 0.7)',
    'rgba(0, 200, 255, ',
    'rgba(255, 215, 0, 0.8)'
  );

  initNetworkAnimation(
    'cifrasCanvas',
    'rgba(0, 210, 255, 0.7)',
    'rgba(0, 200, 255, ',
    'rgba(255, 215, 0, 0.8)'
  );

});
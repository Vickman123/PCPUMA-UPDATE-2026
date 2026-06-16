/**
 * Script de Animaciones para el nuevo Hero de PC Puma
 * Controla la red de partículas interactiva (Canvas) y el rotador de texto dinámico.
 */

document.addEventListener('DOMContentLoaded', () => {
  // === 1. ROTADOR DE TEXTO DINÁMICO ===
  const initTextRotator = () => {
    const words = document.querySelectorAll('.rotator-word');
    if (words.length === 0) return;

    let currentIndex = 0;
    const intervalTime = 3000; // 3 segundos por palabra

    const rotateWords = () => {
      // Remover clase active del elemento actual
      words[currentIndex].classList.remove('active');
      
      // Calcular siguiente índice
      currentIndex = (currentIndex + 1) % words.length;
      
      // Agregar clase active al siguiente elemento
      words[currentIndex].classList.add('active');
    };

    // Iniciar intervalo
    setInterval(rotateWords, intervalTime);
  };

  // === 2. ANIMACIÓN DE LA RED DE PARTÍCULAS (CANVAS) ===
  const initHeroCanvas = () => {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrameId = null;
    let isVisible = true;

    // Configuración de la red
    const config = {
      particleCount: 80,       // Cantidad de nodos
      maxDistance: 150,        // Distancia máxima de conexión
      speed: 0.35,             // Velocidad del movimiento
      particleColor: 'rgba(0, 210, 255, 0.7)', // Celeste tecnológico
      lineColorPrefix: 'rgba(0, 200, 255, ',   // Prefijo de color para líneas
      accentParticleColor: 'rgba(255, 215, 0, 0.8)' // Dorado ocasional
    };

    const maxDistanceSq = config.maxDistance * config.maxDistance;

    // Crear partículas con profundidades y velocidades aleatorias
    const createParticles = () => {
      particles = [];
      for (let i = 0; i < config.particleCount; i++) {
        const z = Math.random() * 2 + 0.5; // Profundidad virtual (efecto 3D)
        const isAccent = Math.random() > 0.85; // 15% de partículas doradas
        
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * config.speed,
          vy: (Math.random() - 0.5) * config.speed,
          z,
          color: isAccent ? config.accentParticleColor : config.particleColor,
          radius: (isAccent ? 1.8 : 1.2) + Math.random() * 1.2
        });
      }
    };

    // Ajustar dimensiones y manejar alta densidad de píxeles (DPI)
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      // Adaptar el número de partículas responsivamente para maximizar FPS en móviles
      if (width < 768) {
        config.particleCount = 28; // Móviles
      } else if (width < 1200) {
        config.particleCount = 50; // Tablets
      } else {
        config.particleCount = 80; // Escritorios
      }
      
      createParticles();
    };

    // Animación principal
    const animate = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      // 1. Actualizar posiciones
      for (let p of particles) {
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;

        // Rebotar en bordes
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      // 2. Dibujar conexiones
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
            if (p1.color === config.accentParticleColor || p2.color === config.accentParticleColor) {
              ctx.strokeStyle = `rgba(255, 215, 0, ${alpha * 1.2})`;
            } else {
              ctx.strokeStyle = `${config.lineColorPrefix}${alpha})`;
            }
            
            ctx.lineWidth = 0.5 * avgZ;
            ctx.stroke();
          }
        }
      }

      // 3. Dibujar partículas (nodos)
      for (let p of particles) {
        const size = p.radius * p.z;
        
        // Dibujar el nodo base
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        // Brillo concéntrico optimizado (en lugar de shadowBlur que es extremadamente costoso)
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * (p.color === config.accentParticleColor ? 2.5 : 1.8), 0, Math.PI * 2);
        const glowColor = p.color.replace(/[\d.]+\)$/, '0.12)');
        ctx.fillStyle = glowColor;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Detener animación si la pestaña está oculta
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        isVisible = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        isVisible = true;
        animate();
      }
    });

    // Detener animación si el Hero no está visible en pantalla (scroll)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          animate();
        } else {
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(canvas.parentElement);

    // Inicializar canvas y eventos
    resizeCanvas();
    animate();
    window.addEventListener('resize', resizeCanvas);
  };

  // Inicializar componentes del Hero
  initTextRotator();
  initHeroCanvas();

  // === 3. ROTACIÓN DE LAS TARJETAS ESTADÍSTICAS FLOTANTES ===
  const initFloatingStatsRotation = () => {
    const card1 = document.querySelector('.floating-card-1');
    const card2 = document.querySelector('.floating-card-2');
    const card3 = document.querySelector('.floating-card-3');
    if (!card1 || !card2 || !card3) return;

    const statsData = [
      // Card 1 states (WiFi / Conectividad)
      [
        { number: "12,812", label: "Antenas WiFi activas", icon: "bi-wifi" },
        { number: "6,968", label: "Aulas y lab. conectados", icon: "bi-building" }
      ],
      // Card 2 states (Dispositivos / Préstamos)
      [
        { number: "13,139", label: "Dispositivos de préstamo", icon: "bi-laptop" },
        { number: "285,132", label: "Préstamos realizados", icon: "bi-check-circle" }
      ],
      // Card 3 states (Usuarios / Entidades)
      [
        { number: "333,777", label: "Usuarios beneficiados*", icon: "bi-people-fill" },
        { number: "71", label: "Entidades participantes", icon: "bi-mortarboard-fill" }
      ]
    ];

    let currentState = 0; // 0 o 1

    const updateCardContent = (card, data) => {
      const icon = card.querySelector('.icon-box i');
      const number = card.querySelector('.card-number');
      const label = card.querySelector('.card-label');

      if (icon) {
        icon.className = `bi ${data.icon}`;
      }
      if (number) {
        number.textContent = data.number;
      }
      if (label) {
        label.textContent = data.label;
      }
    };

    const rotateStats = () => {
      currentState = (currentState === 0) ? 1 : 0;

      const cards = [
        { el: card1, data: statsData[0][currentState] },
        { el: card2, data: statsData[1][currentState] },
        { el: card3, data: statsData[2][currentState] }
      ];

      cards.forEach((cardObj, index) => {
        setTimeout(() => {
          gsap.to(cardObj.el, {
            opacity: 0,
            scale: 0.9,
            y: "+=8",
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
              updateCardContent(cardObj.el, cardObj.data);
              gsap.to(cardObj.el, {
                opacity: 1,
                scale: 1,
                y: "-=8",
                duration: 0.5,
                ease: "power2.out"
              });
            }
          });
        }, index * 400); // 400ms stagger between cards
      });
    };

    // Set initial values (State 0)
    updateCardContent(card1, statsData[0][0]);
    updateCardContent(card2, statsData[1][0]);
    updateCardContent(card3, statsData[2][0]);

    // Interval to rotate every 6 seconds
    setInterval(rotateStats, 6000);
  };

  initFloatingStatsRotation();
});

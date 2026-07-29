import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let particles = [];
    let stars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create stars
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2,
        opacity: Math.random() * 0.7 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    // Create floating particles
    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      size: Math.random() * 2 + 0.5,
      speedY: -(Math.random() * 0.8 + 0.2),
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: 0,
      maxOpacity: Math.random() * 0.6 + 0.2,
      life: 0,
      maxLife: Math.random() * 300 + 200,
      color: Math.random() > 0.5
        ? `rgba(45, 212, 191,`
        : Math.random() > 0.5
          ? `rgba(99, 102, 241,`
          : `rgba(168, 85, 247,`,
    });

    for (let i = 0; i < 30; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height;
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.01;

      // Draw stars
      stars.forEach(star => {
        const twinkle = Math.sin(t * star.twinkleSpeed * 60 + star.twinkleOffset);
        const opacity = star.opacity * (0.6 + 0.4 * twinkle);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(223, 225, 246, ${opacity})`;
        ctx.fill();
      });

      // Draw grid
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.03)';
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw particles
      particles = particles.filter(p => p.life < p.maxLife);

      if (particles.length < 40 && Math.random() < 0.1) {
        particles.push(createParticle());
      }

      particles.forEach(p => {
        p.life++;
        p.x += p.speedX;
        p.y += p.speedY;

        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.1) {
          p.opacity = (lifeRatio / 0.1) * p.maxOpacity;
        } else if (lifeRatio > 0.8) {
          p.opacity = ((1 - lifeRatio) / 0.2) * p.maxOpacity;
        } else {
          p.opacity = p.maxOpacity;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `${p.color}${p.opacity * 0.4})`);
        gradient.addColorStop(1, `${p.color}0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Aurora orbs
      const drawOrb = (x, y, r, color) => {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, color.replace('opacity', '0.08'));
        gradient.addColorStop(1, color.replace('opacity', '0'));
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      };

      drawOrb(
        -100 + Math.sin(t * 0.3) * 80,
        -100 + Math.cos(t * 0.2) * 60,
        400,
        'rgba(99, 102, 241, opacity)'
      );
      drawOrb(
        canvas.width + 100 + Math.cos(t * 0.25) * 80,
        canvas.height + 100 + Math.sin(t * 0.35) * 60,
        350,
        'rgba(168, 85, 247, opacity)'
      );
      drawOrb(
        canvas.width / 2 + Math.sin(t * 0.15) * 100,
        canvas.height / 2 + Math.cos(t * 0.18) * 80,
        300,
        'rgba(45, 212, 191, opacity)'
      );

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

import React, { useEffect, useRef } from 'react';

function MouseEffect() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const target = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const animationRef = useRef(null);
  const orbs = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    // Create fog orbs
    const orbColors = [
      { r: 139, g: 92, b: 246 },   // purple
      { r: 99, g: 102, b: 241 },   // indigo
      { r: 236, g: 72, b: 153 },   // pink
      { r: 59, g: 130, b: 246 },   // blue
      { r: 16, g: 185, b: 129 },   // teal
    ];

    orbs.current = orbColors.map((color, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 200 + 150,
      color,
      opacity: Math.random() * 0.15 + 0.05,
    }));

    const handleMouseMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse follow
      mouse.current.x += (target.current.x - mouse.current.x) * 0.05;
      mouse.current.y += (target.current.y - mouse.current.y) * 0.05;

      // Draw mouse fog orb
      const mouseGrad = ctx.createRadialGradient(
        mouse.current.x, mouse.current.y, 0,
        mouse.current.x, mouse.current.y, 250
      );
      mouseGrad.addColorStop(0, 'rgba(139, 92, 246, 0.18)');
      mouseGrad.addColorStop(0.4, 'rgba(99, 102, 241, 0.10)');
      mouseGrad.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.beginPath();
      ctx.arc(mouse.current.x, mouse.current.y, 250, 0, Math.PI * 2);
      ctx.fillStyle = mouseGrad;
      ctx.fill();

      // Draw floating fog orbs
      orbs.current.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius;
        if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius;
        if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius;

        const grad = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius
        );
        grad.addColorStop(0, `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, ${orb.opacity})`);
        grad.addColorStop(1, `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, 0)`);

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
     style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}

export default MouseEffect;
import React, { useMemo } from 'react';

export const Starfield = () => {
  // Generate a deterministic collection of stars with various sizes, positions, and twinkle speeds
  const stars = useMemo(() => {
    const list = [];
    const count = 48; // Restrained count to remain lightweight and performant
    for (let i = 0; i < count; i++) {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const size = Math.random() * 2.2 + 0.8;
      const duration = Math.random() * 4 + 3;
      const delay = Math.random() * 5;
      const opacity = Math.random() * 0.7 + 0.2;
      list.push({ id: i, top, left, size, duration, delay, opacity });
    }
    return list;
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Subtle Cosmic Nebula Gradients */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '20%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.04) 50%, transparent 75%)',
          filter: 'blur(60px)',
          borderRadius: '50%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '-10%',
          width: '45vw',
          height: '45vw',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, rgba(14, 165, 233, 0.02) 60%, transparent 80%)',
          filter: 'blur(70px)',
          borderRadius: '50%',
        }}
      />

      {/* Layered Stars */}
      {stars.map((star) => (
        <span
          key={star.id}
          style={{
            position: 'absolute',
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            opacity: star.opacity,
            boxShadow: star.size > 2 ? '0 0 6px 1px rgba(255, 255, 255, 0.8)' : 'none',
            animation: `twinkle ${star.duration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Starfield;

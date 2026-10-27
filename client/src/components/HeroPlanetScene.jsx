import React from 'react';

export const HeroPlanetScene = () => {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{
        width: '100%',
        maxWidth: '480px',
        height: '480px',
        margin: '0 auto',
      }}
    >
      {/* Outer Nebula Glow Aura */}
      <div
        className="absolute rounded-full animate-pulse-slow"
        style={{
          width: '420px',
          height: '420px',
          background:
            'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(56, 189, 248, 0.18) 45%, transparent 72%)',
          filter: 'blur(30px)',
          zIndex: 1,
        }}
      />

      {/* Primary Outer Elliptical Orbital Track */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '440px',
          height: '140px',
          border: '1.5px dashed rgba(99, 102, 241, 0.35)',
          transform: 'rotate(-25deg)',
          zIndex: 2,
        }}
      >
        {/* Orbiting Satellite Body 1 */}
        <div
          className="absolute rounded-full"
          style={{
            width: '14px',
            height: '14px',
            top: '-7px',
            left: '42%',
            background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #38bdf8 60%, #0369a1 100%)',
            boxShadow: '0 0 12px 2px rgba(56, 189, 248, 0.85)',
          }}
        />
      </div>

      {/* Secondary Inner Elliptical Orbital Track */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '360px',
          height: '100px',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          transform: 'rotate(18deg)',
          zIndex: 2,
        }}
      >
        {/* Orbiting Satellite Body 2 */}
        <div
          className="absolute rounded-full"
          style={{
            width: '10px',
            height: '10px',
            bottom: '-5px',
            right: '25%',
            background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #a855f7 60%, #6b21a8 100%)',
            boxShadow: '0 0 10px 2px rgba(168, 85, 247, 0.8)',
          }}
        />
      </div>

      {/* The Central Richly Shaded Planet */}
      <div
        className="relative rounded-full overflow-hidden animate-float"
        style={{
          width: '270px',
          height: '270px',
          background:
            'radial-gradient(circle at 35% 32%, #e0e7ff 0%, #818cf8 28%, #4f46e5 55%, #1e1b4b 82%, #09081a 100%)',
          boxShadow:
            'inset -20px -20px 42px rgba(0, 0, 0, 0.96), inset 10px 10px 20px rgba(255, 255, 255, 0.45), 0 0 45px -5px rgba(99, 102, 241, 0.55), 0 0 80px -10px rgba(56, 189, 248, 0.3)',
          zIndex: 3,
        }}
      >
        {/* Dynamic Atmospheric Cloud Swirls */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 65% 45%, rgba(56, 189, 248, 0.55) 0%, transparent 40%), radial-gradient(circle at 30% 65%, rgba(139, 92, 246, 0.45) 0%, transparent 40%)',
            mixBlendMode: 'screen',
            opacity: 0.85,
          }}
        />

        {/* Diagonal Atmospheric Wave Textures */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(28deg, transparent, transparent 18px, rgba(255, 255, 255, 0.08) 18px, rgba(255, 255, 255, 0.08) 26px)',
            opacity: 0.7,
            mixBlendMode: 'overlay',
          }}
        />

        {/* Deep Curved Terminator Shadow (Day/Night transition) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 32% 30%, transparent 35%, rgba(15, 23, 42, 0.6) 65%, rgba(2, 6, 23, 0.96) 95%)',
          }}
        />
      </div>

      {/* Front Foreground Arch of Orbital Ring */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '440px',
          height: '140px',
          borderBottom: '2px solid rgba(99, 102, 241, 0.65)',
          transform: 'rotate(-25deg)',
          clipPath: 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)',
          zIndex: 4,
          filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))',
        }}
      />
    </div>
  );
};

export default HeroPlanetScene;

import React from 'react';

// Planet visual styling dictionary
const planetStyles = {
  mercury: {
    baseGradient: 'radial-gradient(circle at 35% 35%, #cbd5e1 0%, #64748b 45%, #1e293b 85%, #0f172a 100%)',
    coronaColor: 'rgba(203, 213, 225, 0.4)',
    texture: 'radial-gradient(circle at 60% 40%, rgba(30, 41, 59, 0.6) 0%, transparent 20%), radial-gradient(circle at 30% 70%, rgba(30, 41, 59, 0.5) 0%, transparent 15%)',
    hasRings: false,
  },
  venus: {
    baseGradient: 'radial-gradient(circle at 32% 30%, #fef08a 0%, #f59e0b 40%, #b45309 80%, #451a03 100%)',
    coronaColor: 'rgba(245, 158, 11, 0.55)',
    texture: 'linear-gradient(45deg, transparent 40%, rgba(217, 119, 6, 0.3) 50%, transparent 60%)',
    hasRings: false,
  },
  earth: {
    baseGradient: 'radial-gradient(circle at 32% 30%, #60a5fa 0%, #2563eb 35%, #047857 55%, #1e3a8a 75%, #020617 100%)',
    coronaColor: 'rgba(56, 189, 248, 0.65)',
    texture: 'radial-gradient(circle at 65% 55%, rgba(16, 185, 129, 0.7) 0%, transparent 30%), radial-gradient(circle at 35% 45%, rgba(255, 255, 255, 0.45) 0%, transparent 25%)',
    hasRings: false,
  },
  mars: {
    baseGradient: 'radial-gradient(circle at 32% 30%, #fca5a5 0%, #ef4444 35%, #b91c1c 70%, #450a0a 100%)',
    coronaColor: 'rgba(239, 68, 68, 0.55)',
    texture: 'radial-gradient(circle at 50% 12%, rgba(255, 255, 255, 0.7) 0%, transparent 15%), radial-gradient(circle at 65% 60%, rgba(127, 29, 29, 0.6) 0%, transparent 35%)',
    hasRings: false,
  },
  jupiter: {
    baseGradient: 'radial-gradient(circle at 30% 30%, #fed7aa 0%, #ea580c 45%, #9a3412 75%, #270d04 100%)',
    coronaColor: 'rgba(249, 115, 22, 0.55)',
    texture: 'repeating-linear-gradient(0deg, rgba(124, 45, 18, 0.4) 0px, rgba(124, 45, 18, 0.4) 10px, transparent 10px, transparent 20px), radial-gradient(circle at 70% 65%, rgba(185, 28, 28, 0.9) 0%, transparent 12%)',
    hasRings: false,
  },
  saturn: {
    baseGradient: 'radial-gradient(circle at 30% 30%, #fef08a 0%, #eab308 35%, #a16207 70%, #422006 100%)',
    coronaColor: 'rgba(234, 179, 8, 0.5)',
    texture: 'repeating-linear-gradient(0deg, rgba(113, 63, 18, 0.3) 0px, rgba(113, 63, 18, 0.3) 6px, transparent 6px, transparent 14px)',
    hasRings: true,
    ringColor: 'rgba(234, 179, 8, 0.75)',
  },
  uranus: {
    baseGradient: 'radial-gradient(circle at 32% 30%, #a5f3fc 0%, #2dd4bf 40%, #0f766e 75%, #042f2e 100%)',
    coronaColor: 'rgba(45, 212, 191, 0.55)',
    texture: 'linear-gradient(90deg, transparent 45%, rgba(255, 255, 255, 0.15) 50%, transparent 55%)',
    hasRings: true,
    ringColor: 'rgba(45, 212, 191, 0.45)',
  },
  neptune: {
    baseGradient: 'radial-gradient(circle at 32% 30%, #93c5fd 0%, #3b82f6 35%, #1d4ed8 65%, #0f172a 100%)',
    coronaColor: 'rgba(59, 130, 246, 0.6)',
    texture: 'radial-gradient(circle at 60% 45%, rgba(30, 58, 138, 0.8) 0%, transparent 22%), linear-gradient(135deg, transparent 40%, rgba(147, 197, 253, 0.3) 48%, transparent 54%)',
    hasRings: true,
    ringColor: 'rgba(59, 130, 246, 0.35)',
  },
};

const sizeMap = {
  xs: { sphere: 36, container: 52 },
  sm: { sphere: 54, container: 74 },
  md: { sphere: 90, container: 130 },
  lg: { sphere: 150, container: 210 },
  xl: { sphere: 240, container: 330 },
  hero: { sphere: 310, container: 420 },
};

export const PlanetVisual = ({
  slug = 'earth',
  size = 'md',
  animate = true,
  className = '',
  style = {},
}) => {
  const normSlug = slug?.toLowerCase() || 'earth';
  const planet = planetStyles[normSlug] || planetStyles.earth;
  const dimensions = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`planet-visual-container relative flex items-center justify-center ${
        animate ? 'animate-float' : ''
      } ${className}`}
      style={{
        width: `${dimensions.container}px`,
        height: `${dimensions.container}px`,
        ...style,
      }}
    >
      {/* Outer Atmospheric Corona Glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: `${dimensions.sphere * 1.15}px`,
          height: `${dimensions.sphere * 1.15}px`,
          background: `radial-gradient(circle, ${planet.coronaColor} 0%, transparent 70%)`,
          filter: 'blur(10px)',
          pointerEvents: 'none',
        }}
      />

      {/* Rings behind planet for Saturn / Uranus / Neptune */}
      {planet.hasRings && (
        <div
          className="absolute pointer-events-none"
          style={{
            width: `${dimensions.sphere * 2.3}px`,
            height: `${dimensions.sphere * 0.75}px`,
            borderRadius: '50%',
            border: `3px solid ${planet.ringColor}`,
            boxShadow: `0 0 16px ${planet.coronaColor}, inset 0 0 14px ${planet.coronaColor}`,
            transform: normSlug === 'uranus' ? 'rotate(85deg)' : 'rotate(-25deg)',
            opacity: 0.85,
          }}
        >
          {/* Inner Cassini gap ring for Saturn */}
          {normSlug === 'saturn' && (
            <div
              style={{
                position: 'absolute',
                inset: '6px',
                borderRadius: '50%',
                border: '2px solid rgba(254, 240, 138, 0.45)',
              }}
            />
          )}
        </div>
      )}

      {/* Main Celestial Sphere */}
      <div
        className="relative rounded-full overflow-hidden"
        style={{
          width: `${dimensions.sphere}px`,
          height: `${dimensions.sphere}px`,
          background: planet.baseGradient,
          boxShadow: `inset -14px -14px 28px rgba(0, 0, 0, 0.95), inset 6px 6px 14px rgba(255, 255, 255, 0.35), 0 0 30px -4px ${planet.coronaColor}`,
          zIndex: 2,
        }}
      >
        {/* Surface texture overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: planet.texture,
            mixBlendMode: 'overlay',
            opacity: 0.8,
          }}
        />

        {/* Shadow Terminator (day/night curvature) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 35% 35%, transparent 40%, rgba(3, 7, 18, 0.75) 75%, rgba(0, 0, 0, 0.98) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Foreground Rings overlapping the planet */}
      {planet.hasRings && (
        <div
          className="absolute pointer-events-none"
          style={{
            width: `${dimensions.sphere * 2.3}px`,
            height: `${dimensions.sphere * 0.75}px`,
            borderRadius: '50%',
            border: `3px solid ${planet.ringColor}`,
            clipPath: 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)',
            transform: normSlug === 'uranus' ? 'rotate(85deg)' : 'rotate(-25deg)',
            zIndex: 3,
            opacity: 0.9,
          }}
        />
      )}
    </div>
  );
};

export default PlanetVisual;

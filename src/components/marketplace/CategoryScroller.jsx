import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import tools3d from '@/assets/icons/tools-3d.jpg';
import lighting3d from '@/assets/icons/lighting-3d.jpg';
import paint3d from '@/assets/icons/paint-3d.jpg';
import gardening3d from '@/assets/icons/gardening-3d.jpg';
import building3d from '@/assets/icons/building-3d.jpg';
import ChromaKeyImage from '@/components/ui/ChromaKeyImage';

// New visual: minimal black glyph icons inside soft glass squares
const categories = [
  {
    name: 'חומרי בניין',
    category: 'building_materials',
    img: building3d,
    glowFrom: '#94a3b8',
    glowTo: '#64748b'
  },
  {
    name: 'גינון',
    category: 'gardening',
    img: gardening3d,
    glowFrom: '#86efac',
    glowTo: '#22c55e'
  },
  {
    name: 'צבע',
    category: 'painting_supplies',
    img: paint3d,
    glowFrom: '#c4b5fd',
    glowTo: '#8b5cf6'
  },
  {
    name: 'חשמל ותאורה',
    category: 'electrical_supplies',
    img: lighting3d,
    glowFrom: '#fde047',
    glowTo: '#fbbf24'
  },
  {
    name: 'כלי עבודה',
    category: 'tools',
    img: tools3d,
    glowFrom: '#93c5fd',
    glowTo: '#60a5fa'
  },
];

export default function CategoryScroller() {
  return (
    <div className="px-4 py-3">
      <div className="flex gap-6 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {categories.map((cat) => (
          <Link
            key={cat.category}
            to={createPageUrl('Marketplace') + '?category=' + cat.category}
            className="flex flex-col items-center gap-2 flex-shrink-0 group"
          >
            {/* No bubble: show only the object, background is the page itself */}
            <div className="relative w-[120px] h-[120px] flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all duration-300 ease-out">
              {/* Base soft glow */}
              <div
                className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-70 blur-[16px] animate-[pulseGlow_2.2s_ease-in-out_infinite]"
                style={{ background: `radial-gradient(70% 70% at 50% 50%, ${cat.glowTo}66, ${cat.glowFrom}22 60%, transparent 100%)` }}
              />
              {/* Hover vivid glow per category */}
              <div
                className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-0 group-hover:opacity-100 blur-[24px] transition-all duration-300"
                style={{ background: `radial-gradient(72% 72% at 50% 50%, ${cat.glowTo}cc, ${cat.glowFrom}88 62%, transparent 100%)` }}
              />
              <ChromaKeyImage
                src={cat.img}
                alt={cat.name}
                className="max-w-[92%] max-h-[92%] object-contain object-center p-0 drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)] group-hover:drop-shadow-[0_8px_14px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-all duration-300 ease-out group-hover:animate-[wiggle_0.7s_ease-in-out_infinite]"
                threshold={246}
                edgeErode={2}
                feather={1}
                autoCropPadding={0}
                sampleEdges={true}
                tolerance={24}
                minOpaqueRatio={0.02}
              />
            </div>
            <div className="mt-2 text-sm font-extrabold text-blue-700 dark:text-gray-200 drop-shadow-sm">
              {cat.name}
            </div>
          </Link>
        ))}
      </div>
      {/* Effects for glow + wiggle */}
      <style>{`
        @keyframes wiggle {
          0% { transform: rotate(0deg) scale(1); }
          12% { transform: rotate(4deg) scale(1.02); }
          50% { transform: rotate(0deg) scale(1); }
          88% { transform: rotate(-4deg) scale(1.02); }
          100% { transform: rotate(0deg) scale(1); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.72; filter: blur(16px); }
          50% { opacity: 0.96; filter: blur(22px); }
        }
      `}</style>
    </div>
  );
}
import { useEffect, useRef } from "react";

const GOLD_COLORS = ["#D4AF37", "#E8C84A", "#FFF1AA", "#C9A227", "#F8E4AE"];
type ParticleType = "star" | "crescent" | "sparkle" | "dot";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; baseOpacity: number; type: ParticleType;
  rotation: number; vRotation: number; twinkleSpeed: number; twinkleOffset: number;
  colorIdx: number;
}

function makeCrescentCanvas(radius: number, color: string): HTMLCanvasElement {
  const d = (radius + 4) * 2;
  const oc = document.createElement("canvas");
  oc.width = d;
  oc.height = d;
  const ctx = oc.getContext("2d")!;
  const c = d / 2;
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = radius;
  ctx.beginPath();
  ctx.arc(c, c, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.beginPath();
  ctx.arc(c + radius * 0.45, c, radius * 0.78, 0, Math.PI * 2);
  ctx.fill();
  return oc;
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let particles: Particle[] = [];
    const crescentSprites = new Map<string, HTMLCanvasElement>();
    const crescentSizes = [5, 7, 10, 13];
    for (const sz of crescentSizes)
      for (const col of GOLD_COLORS)
        crescentSprites.set(`${sz}-${col}`, makeCrescentCanvas(sz, col));

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    const buildParticles = () => {
      const count = Math.max(40, Math.floor((canvas.width * canvas.height) / 9000));
      particles = Array.from({ length: count }, () => {
        const roll = Math.random();
        const type: ParticleType = roll < 0.55 ? "dot" : roll < 0.75 ? "star" : roll < 0.9 ? "sparkle" : "crescent";
        return {
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.25, vy: -(Math.random() * 0.35 + 0.08),
          size: type === "crescent" ? crescentSizes[Math.floor(Math.random() * crescentSizes.length)] : type === "sparkle" ? Math.random()*4+3 : Math.random()*2.5+1,
          baseOpacity: Math.random()*0.5+0.2, type, rotation: Math.random()*Math.PI*2,
          vRotation: (Math.random()-0.5)*0.015, twinkleSpeed: Math.random()*0.025+0.005,
          twinkleOffset: Math.random()*Math.PI*2, colorIdx: Math.floor(Math.random()*GOLD_COLORS.length)
        };
      });
    };

    let t = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t++;
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.rotation += p.vRotation;
        if (p.y < -20) p.y = canvas.height + 20, p.x = Math.random()*canvas.width;
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        // draw particle types here if you like
      }
      animId = requestAnimationFrame(animate);
    };

    resize(); buildParticles(); animate();
    window.addEventListener("resize", () => { resize(); buildParticles(); });
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-1" style={{ mixBlendMode: "screen", opacity: 0.65 }} />;
};

export default ParticleBackground;

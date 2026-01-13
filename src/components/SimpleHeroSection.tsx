'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export function SimpleHeroSection() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<any[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // إعداد الكانفاس
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // إنشاء الجسيمات الذكية المتطورة مع تحسينات جديدة
    const createParticles = () => {
      const particles = [];
      const colors = [
        '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#e879f9', '#f0abfc',
        '#fbbf24', '#f59e0b', '#06b6d4', '#0891b2', '#10b981', '#059669',
        '#f97316', '#ea580c', '#dc2626', '#b91c1c', '#7c3aed', '#6d28d9'
      ];

      for (let i = 0; i < 200; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 8 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.8 + 0.2,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.008 + Math.random() * 0.04,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
          magnetism: Math.random() * 0.8 + 0.6, // قوة جذب أقوى
          trail: [], // مسار الجسيمة
          energy: Math.random() * 100 + 50, // طاقة الجسيمة
          type: Math.floor(Math.random() * 3), // نوع الجسيمة (دائرة، مربع، نجمة)
          phase: Math.random() * Math.PI * 2, // طور للحركة الموجية
          amplitude: Math.random() * 20 + 10 // سعة الحركة الموجية
        });
      }

      particlesRef.current = particles;
    };

    createParticles();

    // معالج حركة الماوس
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // دالة رسم السداسي
    const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const px = x + size * Math.cos(angle);
        const py = y + size * Math.sin(angle);

        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.stroke();
    };

    // حلقة الرسم المتطورة مع تأثيرات مبهرة
    const animate = () => {
      // مسح تدريجي بدلاً من المسح الكامل
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;
      const mouseX = mouseRef.current.x * canvas.width * 0.5 + canvas.width * 0.5;
      const mouseY = mouseRef.current.y * canvas.height * 0.5 + canvas.height * 0.5;

      // رسم هالة تتبع الماوس المتوهجة المحسنة
      if (mouseRef.current.x !== 0 || mouseRef.current.y !== 0) {
        // هالة خارجية كبيرة
        const outerGlowSize = 150 + Math.sin(time * 2) * 30;
        const outerGradient = ctx.createRadialGradient(
          mouseX, mouseY, 0,
          mouseX, mouseY, outerGlowSize
        );

        outerGradient.addColorStop(0, `rgba(168, 85, 247, ${0.2 + Math.sin(time * 1.5) * 0.08})`);
        outerGradient.addColorStop(0.2, `rgba(236, 72, 153, ${0.15 + Math.sin(time * 2) * 0.06})`);
        outerGradient.addColorStop(0.4, `rgba(251, 191, 36, ${0.1 + Math.sin(time * 2.5) * 0.04})`);
        outerGradient.addColorStop(0.6, `rgba(6, 182, 212, ${0.08 + Math.sin(time * 3) * 0.03})`);
        outerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, outerGlowSize, 0, Math.PI * 2);
        ctx.fill();

        // هالة متوسطة
        const midGlowSize = 80 + Math.sin(time * 3) * 15;
        const midGradient = ctx.createRadialGradient(
          mouseX, mouseY, 0,
          mouseX, mouseY, midGlowSize
        );

        midGradient.addColorStop(0, `rgba(139, 92, 246, ${0.3 + Math.sin(time * 2.5) * 0.1})`);
        midGradient.addColorStop(0.5, `rgba(168, 85, 247, ${0.2 + Math.sin(time * 3) * 0.08})`);
        midGradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

        ctx.fillStyle = midGradient;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, midGlowSize, 0, Math.PI * 2);
        ctx.fill();

        // دائرة مركزية نابضة
        const centerSize = 20 + Math.sin(time * 4) * 8;
        const centerGradient = ctx.createRadialGradient(
          mouseX, mouseY, 0,
          mouseX, mouseY, centerSize
        );
        centerGradient.addColorStop(0, `rgba(255, 255, 255, ${0.9 + Math.sin(time * 5) * 0.1})`);
        centerGradient.addColorStop(0.7, `rgba(168, 85, 247, ${0.6 + Math.sin(time * 4) * 0.2})`);
        centerGradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

        ctx.fillStyle = centerGradient;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, centerSize, 0, Math.PI * 2);
        ctx.fill();

        // رسم موجات متطورة تنتشر من موضع الماوس
        for (let i = 0; i < 5; i++) {
          const waveRadius = 30 + (time * 80 + i * 40) % 250;
          const waveAlpha = Math.max(0, 0.4 - (waveRadius / 250) * 0.4);

          if (waveAlpha > 0.01) {
            // موجة رئيسية
            ctx.strokeStyle = `rgba(168, 85, 247, ${waveAlpha})`;
            ctx.lineWidth = 3 - (waveRadius / 250) * 2;
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, waveRadius, 0, Math.PI * 2);
            ctx.stroke();

            // موجة ثانوية متداخلة
            const secondaryRadius = waveRadius * 0.7;
            const secondaryAlpha = waveAlpha * 0.6;
            ctx.strokeStyle = `rgba(236, 72, 153, ${secondaryAlpha})`;
            ctx.lineWidth = 2 - (secondaryRadius / 250) * 1.5;
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, secondaryRadius, 0, Math.PI * 2);
            ctx.stroke();

            // موجة داخلية
            if (i % 2 === 0) {
              const innerRadius = waveRadius * 0.4;
              const innerAlpha = waveAlpha * 0.8;
              ctx.strokeStyle = `rgba(251, 191, 36, ${innerAlpha})`;
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.arc(mouseX, mouseY, innerRadius, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        }
      }

      // رسم موجات ديناميكية في الخلفية
      const waveCount = 5;
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(168, 85, 247, ${Math.max(0.01, 0.02 + Math.sin(time + i) * 0.01)})`;
        ctx.lineWidth = 2;

        for (let x = 0; x <= canvas.width; x += 10) {
          const y = canvas.height * 0.5 +
                   Math.sin(x * 0.01 + time + i) * 50 * (i + 1) +
                   Math.sin(x * 0.005 + time * 0.5 + i) * 30;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // رسم شبكة سداسية متحركة
      const hexSize = 60;
      const hexRows = Math.ceil(canvas.height / (hexSize * 0.75)) + 2;
      const hexCols = Math.ceil(canvas.width / (hexSize * Math.sqrt(3))) + 2;

      ctx.strokeStyle = `rgba(139, 92, 246, ${Math.max(0.01, 0.04 + Math.sin(time * 0.5) * 0.02)})`;
      ctx.lineWidth = 1;

      for (let row = 0; row < hexRows; row++) {
        for (let col = 0; col < hexCols; col++) {
          const x = col * hexSize * Math.sqrt(3) + (row % 2) * hexSize * Math.sqrt(3) * 0.5;
          const y = row * hexSize * 0.75;

          const distanceToMouse = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);
          const influence = Math.max(0, 1 - distanceToMouse / 300); // زيادة نطاق التأثير

          if (influence > 0.05) {
            // تحسين الحركة والحجم حسب قرب الماوس
            const moveIntensity = influence * 15;
            const sizeMultiplier = 0.2 + influence * 0.8;
            const alpha = 0.02 + influence * 0.1;

            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 1 + influence * 2;

            drawHexagon(
              ctx,
              x + Math.sin(time + row + col) * moveIntensity,
              y + Math.cos(time + row + col) * moveIntensity,
              hexSize * sizeMultiplier
            );
          }
        }
      }

      // رسم دوائر متوهجة ناعمة
      const glowCircles = 5;
      for (let i = 0; i < glowCircles; i++) {
        const x = canvas.width * (0.1 + i * 0.2);
        const y = canvas.height * (0.2 + Math.sin(time * 0.3 + i) * 0.3);
        const radius = Math.max(10, 150 + Math.sin(time * 0.4 + i) * 50);

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        const colors = [
          `rgba(168, 85, 247, ${Math.max(0.01, 0.05 + Math.sin(time + i) * 0.02)})`,
          `rgba(236, 72, 153, ${Math.max(0.01, 0.03 + Math.sin(time + i + 1) * 0.015)})`,
          `rgba(251, 191, 36, ${Math.max(0.01, 0.02 + Math.sin(time + i + 2) * 0.01)})`
        ];

        gradient.addColorStop(0, colors[i % colors.length]);
        gradient.addColorStop(0.7, colors[(i + 1) % colors.length].replace(/[\d.]+\)/, '0.01)'));
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // رسم أشكال هندسية متحركة
      const shapes = 3;
      for (let i = 0; i < shapes; i++) {
        const x = canvas.width * (0.3 + i * 0.2);
        const y = canvas.height * (0.4 + Math.cos(time * 0.2 + i) * 0.2);
        const size = Math.max(10, 30 + Math.sin(time + i) * 10);
        const rotation = time * 0.5 + i;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);

        const gradient = ctx.createLinearGradient(-size, -size, size, size);
        gradient.addColorStop(0, `rgba(168, 85, 247, ${Math.max(0.01, 0.1 + Math.sin(time + i) * 0.05)})`);
        gradient.addColorStop(1, `rgba(236, 72, 153, ${Math.max(0.01, 0.05 + Math.cos(time + i) * 0.03)})`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        // استخدام rect بدلاً من roundRect للتوافق مع جميع المتصفحات
        ctx.rect(-size/2, -size/2, size, size);
        ctx.fill();

        ctx.restore();
      }

      // تحديث ورسم الجسيمات الذكية المتطورة
      particlesRef.current.forEach((particle, index) => {
        // التأكد من صحة القيم
        particle.size = Math.max(1, particle.size || 2);
        particle.energy = Math.max(50, Math.min(100, particle.energy || 50));
        particle.opacity = Math.max(0.1, Math.min(1, particle.opacity || 0.5));

        // حفظ الموضع السابق للمسار
        particle.trail.push({ x: particle.x, y: particle.y });
        if (particle.trail.length > 5) {
          particle.trail.shift();
        }

        // تحديث الموضع مع فيزياء متقدمة
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulse += particle.pulseSpeed;

        // تأثير الماوس المغناطيسي المتطور والأكثر ذكاءً
        const mouseInfluence = 250; // نطاق تأثير أوسع
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseInfluence) {
          const force = (mouseInfluence - distance) / mouseInfluence * particle.magnetism;
          const angle = Math.atan2(dy, dx);

          // قوة جذب متدرجة حسب المسافة
          const attractionForce = force * 0.012;
          particle.vx += Math.cos(angle) * attractionForce;
          particle.vy += Math.sin(angle) * attractionForce;

          // تأثير الطاقة المحسن مع تسارع
          particle.energy = Math.min(100, particle.energy + force * 6);

          // حركة موجية إضافية
          particle.phase += 0.1;
          const waveForce = Math.sin(particle.phase) * force * 0.003;
          particle.vx += Math.cos(angle + Math.PI/2) * waveForce;
          particle.vy += Math.sin(angle + Math.PI/2) * waveForce;

          // تأثير اهتزاز ذكي
          const vibrationIntensity = force * 0.004;
          particle.vx += (Math.random() - 0.5) * vibrationIntensity;
          particle.vy += (Math.random() - 0.5) * vibrationIntensity;

          // تسريع الدوران عند القرب من الماوس
          particle.rotationSpeed += force * 0.001;
        } else {
          // تقليل الطاقة والدوران تدريجياً
          particle.energy = Math.max(50, particle.energy - 0.2);
          particle.rotationSpeed *= 0.98;
        }

        // تطبيق الاحتكاك
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // حدود الشاشة مع ارتداد ديناميكي
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.7;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.7;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // رسم مسار الجسيمة
        if (particle.trail.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = particle.color.replace(')', ', 0.2)').replace('rgb', 'rgba');
          ctx.lineWidth = 1;

          for (let i = 0; i < particle.trail.length - 1; i++) {
            const alpha = i / particle.trail.length;
            ctx.globalAlpha = alpha * 0.3;

            if (i === 0) {
              ctx.moveTo(particle.trail[i].x, particle.trail[i].y);
            } else {
              ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
            }
          }
          ctx.stroke();
        }

        // رسم الجسيمة مع تأثيرات متقدمة
        const energyFactor = particle.energy / 100;
        const pulseSize = Math.max(1, particle.size + Math.sin(particle.pulse) * 2 * energyFactor);
        const pulseOpacity = Math.max(0.1, particle.opacity + Math.sin(particle.pulse) * 0.3 * energyFactor);

        // رسم الهالة الخارجية
        const outerRadius = Math.max(1, pulseSize * 4);
        const outerGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, outerRadius
        );
        outerGradient.addColorStop(0, particle.color.replace(')', ', 0.4)').replace('rgb', 'rgba'));
        outerGradient.addColorStop(0.5, particle.color.replace(')', ', 0.2)').replace('rgb', 'rgba'));
        outerGradient.addColorStop(1, particle.color.replace(')', ', 0)').replace('rgb', 'rgba'));

        ctx.fillStyle = outerGradient;
        ctx.globalAlpha = pulseOpacity * 0.6 * energyFactor;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, outerRadius, 0, Math.PI * 2);
        ctx.fill();

        // رسم الهالة الداخلية
        const innerRadius = Math.max(1, pulseSize * 2);
        const innerGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, innerRadius
        );
        innerGradient.addColorStop(0, particle.color.replace(')', ', 0.8)').replace('rgb', 'rgba'));
        innerGradient.addColorStop(1, particle.color.replace(')', ', 0.2)').replace('rgb', 'rgba'));

        ctx.fillStyle = innerGradient;
        ctx.globalAlpha = pulseOpacity * 0.8;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, innerRadius, 0, Math.PI * 2);
        ctx.fill();

        // رسم الجسيمة الأساسية بأشكال مختلفة
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.pulse * particle.rotationSpeed);

        ctx.fillStyle = particle.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, pulseOpacity));

        const finalSize = Math.max(0.5, pulseSize);

        // رسم حسب نوع الجسيمة
        if (particle.type === 0) {
          // دائرة
          ctx.beginPath();
          ctx.arc(0, 0, finalSize, 0, Math.PI * 2);
          ctx.fill();
        } else if (particle.type === 1) {
          // مربع
          ctx.beginPath();
          ctx.rect(-finalSize, -finalSize, finalSize * 2, finalSize * 2);
          ctx.fill();
        } else {
          // نجمة
          ctx.beginPath();
          const spikes = 5;
          const outerRadius = finalSize;
          const innerRadius = finalSize * 0.5;

          for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();

        // رسم خطوط الاتصال الذكية المتطورة
        particlesRef.current.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex && index < otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
              const opacity = Math.max(0, 0.2 * (1 - distance / 150));
              const energyBonus = (particle.energy + otherParticle.energy) / 200;
              const finalOpacity = Math.max(0.01, Math.min(1, opacity * (1 + energyBonus)));

              // خط متدرج ديناميكي
              const gradient = ctx.createLinearGradient(
                particle.x, particle.y,
                otherParticle.x, otherParticle.y
              );

              const color1 = particle.color.replace(')', ', ' + finalOpacity + ')').replace('rgb', 'rgba');
              const color2 = otherParticle.color.replace(')', ', ' + finalOpacity + ')').replace('rgb', 'rgba');
              const midColor = `rgba(192, 132, 252, ${finalOpacity * 1.2})`;

              gradient.addColorStop(0, color1);
              gradient.addColorStop(0.5, midColor);
              gradient.addColorStop(1, color2);

              // رسم خط متموج
              ctx.beginPath();
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 1 + finalOpacity * 3;

              const steps = 10;
              for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const x = particle.x + (otherParticle.x - particle.x) * t;
                const y = particle.y + (otherParticle.y - particle.y) * t;

                // إضافة تموج ناعم
                const waveOffset = Math.sin(t * Math.PI * 2 + time) * 5 * finalOpacity;
                const perpX = -(otherParticle.y - particle.y) / distance;
                const perpY = (otherParticle.x - particle.x) / distance;

                const finalX = x + perpX * waveOffset;
                const finalY = y + perpY * waveOffset;

                if (i === 0) {
                  ctx.moveTo(finalX, finalY);
                } else {
                  ctx.lineTo(finalX, finalY);
                }
              }

              ctx.stroke();

              // إضافة نقاط ضوئية على الخط
              if (finalOpacity > 0.1) {
                const midX = (particle.x + otherParticle.x) / 2;
                const midY = (particle.y + otherParticle.y) / 2;

                ctx.beginPath();
                ctx.arc(midX, midY, Math.max(0.5, 2 * finalOpacity), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, finalOpacity * 0.8)})`;
                ctx.fill();
              }
            }
          }
        });
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // التنظيف
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-purple-50 to-pink-50">
      {/* Canvas للخلفية التفاعلية */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* طبقة تأثير إضافية للثيم الفاتح */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-purple-50/20" style={{ zIndex: 2 }} />

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              TechnoFlash
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            منصتك الشاملة لأحدث التقنيات وأدوات الذكاء الاصطناعي
          </p>
        </div>

        {/* الأزرار */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="/articles"
            className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            <span>استكشف المقالات</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          
          <Link
            href="/ai-tools"
            className="group border-2 border-purple-400 text-purple-400 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-400 hover:text-white transition-all duration-300 flex items-center gap-3"
          >
            <span>أدوات الذكاء الاصطناعي</span>
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </Link>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">100+</div>
            <div className="text-gray-600">مقال تقني</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">50+</div>
            <div className="text-gray-600">أداة ذكاء اصطناعي</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">1000+</div>
            <div className="text-gray-600">قارئ نشط</div>
          </div>
        </div>
      </div>

      {/* مؤشر التمرير */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-8 h-8 border-2 border-gray-400/60 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

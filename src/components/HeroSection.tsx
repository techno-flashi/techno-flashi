'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Link from 'next/link';

export function HeroSection() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let particles: THREE.Points;
    let geometricShapes: THREE.Group;
    let ambientLight: THREE.AmbientLight;
    let pointLight: THREE.PointLight;

    try {
      // إعداد المشهد
      scene = new THREE.Scene();
      sceneRef.current = scene;

      // إعداد الكاميرا
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      // إعداد المُرسِل مع معالجة الأخطاء
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: false
      });

      // فحص دعم WebGL
      const gl = renderer.getContext();
      if (!gl) {
        throw new Error('WebGL not supported');
      }

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      rendererRef.current = renderer;

      mountRef.current.appendChild(renderer.domElement);

      // إعداد الإضاءة
      ambientLight = new THREE.AmbientLight(0x8b5cf6, 0.4);
      scene.add(ambientLight);

      pointLight = new THREE.PointLight(0xa855f7, 1, 100);
      pointLight.position.set(10, 10, 10);
      scene.add(pointLight);

      // إنشاء جسيمات ثلاثية الأبعاد
      const particleCount = 1000;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      const colorPalette = [
        new THREE.Color(0x8b5cf6), // بنفسجي
        new THREE.Color(0xa855f7), // بنفسجي فاتح
        new THREE.Color(0xc084fc), // بنفسجي أفتح
        new THREE.Color(0xd8b4fe), // بنفسجي شاحب
      ];

      for (let i = 0; i < particleCount; i++) {
        // المواقع العشوائية
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        // الألوان العشوائية
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // الأحجام العشوائية
        sizes[i] = Math.random() * 3 + 1;
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      // إنشاء Shader Material مع معالجة الأخطاء
      let particleMaterial: THREE.ShaderMaterial;

      try {
        particleMaterial = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            mouse: { value: new THREE.Vector2() }
          },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          uniform float time;
          uniform vec2 mouse;

          void main() {
            vColor = color;
            vec3 pos = position;

            // تأثير الموجة
            pos.y += sin(pos.x * 0.5 + time) * 0.5;
            pos.x += cos(pos.z * 0.5 + time) * 0.3;

            // تأثير الماوس
            vec2 mouseInfluence = mouse * 0.1;
            pos.xy += mouseInfluence * (1.0 - length(pos.xy) * 0.1);

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / max(-mvPosition.z, 1.0));
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;

          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
            gl_FragColor = vec4(vColor, alpha * 0.8);
          }
        `,
          transparent: true,
          vertexColors: true,
          blending: THREE.AdditiveBlending
        });

        // فحص إذا كان الـ shader تم تجميعه بنجاح
        if (!particleMaterial.vertexShader || !particleMaterial.fragmentShader) {
          throw new Error('Shader compilation failed');
        }

      } catch (shaderError) {
        console.warn('Shader creation failed, using basic material:', shaderError);

        // استخدام مادة أساسية كبديل
        particleMaterial = new THREE.PointsMaterial({
          size: 2,
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending
        });
      }

      particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      // إنشاء أشكال هندسية معقدة
      geometricShapes = new THREE.Group();

      // مكعبات متحركة
      for (let i = 0; i < 5; i++) {
        const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const cubeMaterial = new THREE.MeshPhongMaterial({
          color: colorPalette[i % colorPalette.length],
          transparent: true,
          opacity: 0.3,
          wireframe: true
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        cube.position.set(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        );

        geometricShapes.add(cube);
      }

      // كرات متوهجة
      for (let i = 0; i < 3; i++) {
        const sphereGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const sphereMaterial = new THREE.MeshPhongMaterial({
          color: colorPalette[(i + 2) % colorPalette.length],
          transparent: true,
          opacity: 0.6,
          emissive: colorPalette[(i + 2) % colorPalette.length],
          emissiveIntensity: 0.2
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        sphere.position.set(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8
        );

        geometricShapes.add(sphere);
      }

      scene.add(geometricShapes);

      // حلقة الرسم والتحريك
      const clock = new THREE.Clock();

      const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        // تحريك الجسيمات مع فحص النوع
        if (particles && particles.material) {
          if (particles.material instanceof THREE.ShaderMaterial && particles.material.uniforms) {
            particles.material.uniforms.time.value = elapsedTime;
            particles.material.uniforms.mouse.value.set(
              mouseRef.current.x,
              mouseRef.current.y
            );
          }
        }

        // تدوير الجسيمات
        if (particles) {
          particles.rotation.y = elapsedTime * 0.05;
          particles.rotation.x = Math.sin(elapsedTime * 0.03) * 0.1;
        }

        // تحريك الأشكال الهندسية
        geometricShapes.children.forEach((shape, index) => {
          if (shape instanceof THREE.Mesh) {
            // دوران مختلف لكل شكل
            shape.rotation.x += 0.01 * (index + 1);
            shape.rotation.y += 0.015 * (index + 1);

            // حركة تموجية
            shape.position.y += Math.sin(elapsedTime + index) * 0.002;
            shape.position.x += Math.cos(elapsedTime * 0.5 + index) * 0.001;
          }
        });

        // تحريك الإضاءة
        pointLight.position.x = Math.sin(elapsedTime) * 5;
        pointLight.position.z = Math.cos(elapsedTime) * 5;
        pointLight.intensity = 0.8 + Math.sin(elapsedTime * 2) * 0.2;

        // تأثير الماوس على الكاميرا
        camera.position.x += (mouseRef.current.x * 0.001 - camera.position.x) * 0.05;
        camera.position.y += (-mouseRef.current.y * 0.001 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        animationRef.current = requestAnimationFrame(animate);
      };

      animate();

      // معالج حركة الماوس
      const handleMouseMove = (event: MouseEvent) => {
        mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      };

      // معالج تغيير حجم النافذة
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      };

      // إضافة المستمعين
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('resize', handleResize);

      // التنظيف
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }

        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);

        // تنظيف Three.js
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }

        // تنظيف الذاكرة بأمان
        if (scene) {
          scene.clear();
        }
        if (renderer) {
          renderer.dispose();
        }

        // تنظيف الهندسة والمواد بأمان
        if (particles) {
          if (particles.geometry) {
            particles.geometry.dispose();
          }
          if (particles.material) {
            (particles.material as THREE.Material).dispose();
          }
        }

        if (geometricShapes) {
          geometricShapes.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
              if (child.geometry) {
                child.geometry.dispose();
              }
              if (child.material) {
                (child.material as THREE.Material).dispose();
              }
            }
          });
        }
      };

    } catch (error) {
      console.warn('WebGL/Three.js initialization failed:', error);
      setIsWebGLSupported(false);
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Three.js Canvas للخلفية ثلاثية الأبعاد */}
      {isWebGLSupported && (
        <div
          ref={mountRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 1 }}
        />
      )}

      {/* Fallback gradient للأجهزة التي لا تدعم WebGL */}
      {!isWebGLSupported && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-purple-600/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]" />
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(168,85,247,0.1),rgba(192,132,252,0.1),rgba(168,85,247,0.1))]" />
        </div>
      )}

      {/* طبقة تأثير إضافية */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/30" style={{ zIndex: 2 }} />

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* الشعار الصغير */}
        <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md text-purple-200 text-sm font-semibold rounded-full mb-8 border border-purple-300/30 shadow-lg">
          <span className="mr-2 text-lg">✨</span>
          بوابتك للمستقبل التقني
        </div>

        {/* العنوان الرئيسي */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6">
          مستقبلك التقني
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 animate-pulse">
            يبدأ من هنا
          </span>
        </h1>

        {/* الوصف */}
        <p className="max-w-4xl mx-auto text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed font-light">
          اكتشف أحدث التقنيات، أدوات الذكاء الاصطناعي المتطورة، ومقالات تقنية متخصصة لتطوير مهاراتك
          وتحقيق أهدافك في عالم التكنولوجيا المتطور.
        </p>

        {/* أزرار الإجراء */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-20">
          <Link
            href="/articles"
            className="group relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-105 font-semibold text-lg min-w-[220px] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center justify-center">
              ابدأ الاستكشاف
              <svg className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
          </Link>

          <Link
            href="/ai-tools"
            className="group relative bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-2xl border border-white/30 hover:bg-white/20 hover:border-purple-400/50 transition-all duration-500 font-semibold text-lg min-w-[220px] shadow-xl"
          >
            <span className="flex items-center justify-center">
              أدوات الذكاء الاصطناعي
              <svg className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
          </Link>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {[
            { number: "500+", label: "مقال تقني" },
            { number: "50+", label: "أداة ذكية" },
            { number: "10K+", label: "قارئ نشط" },
            { number: "24/7", label: "دعم فني" }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm md:text-base font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* مؤشر التمرير */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-8 h-8 border-2 border-white/40 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* مؤشر WebGL */}
      {isWebGLSupported && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/30">
            ✓ WebGL Active
          </div>
        </div>
      )}
    </section>
  );
}

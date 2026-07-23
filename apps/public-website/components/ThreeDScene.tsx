'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeDSceneProps {
  className?: string;
  type?: 'molecule' | 'floating-bars' | 'dna-helix';
  color?: string;
  secondaryColor?: string;
  count?: number;
}

export default function ThreeDScene({ className = '', type = 'molecule', color = '#6366f1', secondaryColor = '#8b5cf6', count = 50 }: ThreeDSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 15;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create 3D objects based on type
    const group = new THREE.Group();
    const color1 = new THREE.Color(color);
    const color2 = new THREE.Color(secondaryColor);

    if (type === 'molecule') {
      // Molecular structure: spheres connected by lines
      const positions: THREE.Vector3[] = [];
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 3 + Math.random() * 4;
        positions.push(new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ));
      }

      // Spheres
      positions.forEach((pos, i) => {
        const size = 0.15 + Math.random() * 0.25;
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(size, 12, 12),
          new THREE.MeshPhongMaterial({
            color: i % 3 === 0 ? color1 : i % 3 === 1 ? color2 : new THREE.Color('#06b6d4'),
            emissive: i % 3 === 0 ? color1 : i % 3 === 1 ? color2 : new THREE.Color('#06b6d4'),
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.8,
          }),
        );
        sphere.position.copy(pos);
        group.add(sphere);
      });

      // Connections
      const lineMaterial = new THREE.LineBasicMaterial({
        color: color1,
        transparent: true,
        opacity: 0.15,
      });
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          if (positions[i].distanceTo(positions[j]) < 2.5 && Math.random() < 0.3) {
            const geometry = new THREE.BufferGeometry().setFromPoints([positions[i], positions[j]]);
            const line = new THREE.Line(geometry, lineMaterial);
            group.add(line);
          }
        }
      }
    } else if (type === 'floating-bars') {
      // Floating 3D bars
      for (let i = 0; i < count; i++) {
        const height = 0.5 + Math.random() * 3;
        const bar = new THREE.Mesh(
          new THREE.BoxGeometry(0.3, height, 0.3),
          new THREE.MeshPhongMaterial({
            color: i % 2 === 0 ? color1 : color2,
            emissive: i % 2 === 0 ? color1 : color2,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.7,
          }),
        );
        bar.position.set(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 8,
        );
        bar.rotation.set(Math.random() * 0.5, Math.random() * 0.5, 0);
        (bar as any)._speed = 0.2 + Math.random() * 0.5;
        (bar as any)._rotSpeed = 0.005 + Math.random() * 0.01;
        group.add(bar);
      }
    } else if (type === 'dna-helix') {
      // DNA-like double helix
      const helixRadius = 2;
      const helixHeight = 8;
      const turns = 3;
      const steps = 60;
      const sphereMat = new THREE.MeshPhongMaterial({
        color: color1, emissive: color1, emissiveIntensity: 0.3, transparent: true, opacity: 0.8,
      });
      const sphereMat2 = new THREE.MeshPhongMaterial({
        color: color2, emissive: color2, emissiveIntensity: 0.3, transparent: true, opacity: 0.8,
      });

      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const angle = t * Math.PI * 2 * turns;
        const y = -helixHeight / 2 + t * helixHeight;

        // Strand 1
        const pos1 = new THREE.Vector3(helixRadius * Math.cos(angle), y, helixRadius * Math.sin(angle));
        const sphere1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), sphereMat);
        sphere1.position.copy(pos1);
        group.add(sphere1);

        // Strand 2
        const pos2 = new THREE.Vector3(helixRadius * Math.cos(angle + Math.PI), y, helixRadius * Math.sin(angle + Math.PI));
        const sphere2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), sphereMat2);
        sphere2.position.copy(pos2);
        group.add(sphere2);

        // Rungs
        if (i % 3 === 0) {
          const rungGeo = new THREE.BufferGeometry().setFromPoints([pos1, pos2]);
          const rung = new THREE.Line(rungGeo, new THREE.LineBasicMaterial({ color: color1, transparent: true, opacity: 0.2 }));
          group.add(rung);
        }
      }
    }

    scene.add(group);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0x8888ff, 0.4);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);

    // Animation loop
    const animate = () => {
      if (type === 'molecule') {
        group.rotation.x += 0.002;
        group.rotation.y += 0.003;
      } else if (type === 'floating-bars') {
        group.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.position.y += Math.sin(Date.now() * 0.001 * (child as any)._speed) * 0.002;
            child.rotation.x += (child as any)._rotSpeed;
            child.rotation.y += (child as any)._rotSpeed;
          }
        });
        group.rotation.y += 0.001;
      } else if (type === 'dna-helix') {
        group.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [color, secondaryColor, type, count]);

  return <div ref={containerRef} className={`${className}`} style={{ width: '100%', height: '100%' }} />;
}
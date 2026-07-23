'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Package3DModelProps {
  className?: string;
  packageName?: string;
  price?: number;
  color?: string;
  accentColor?: string;
}

export default function Package3DModel({
  className = '',
  packageName = 'Package',
  price = 49,
  color = '#6366f1',
  accentColor = '#8b5cf6',
}: Package3DModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4, 3, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Main group
    const group = new THREE.Group();

    // Gift box base
    const boxMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.1,
      specular: new THREE.Color(0x444444),
      shininess: 30,
      transparent: true,
      opacity: 0.9,
    });

    const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), boxMat);
    box.castShadow = true;
    box.position.y = 1;
    group.add(box);

    // Lid
    const lidMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(accentColor),
      emissive: new THREE.Color(accentColor),
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.85,
    });
    const lid = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.3, 2.1), lidMat);
    lid.position.y = 2.15;
    lid.castShadow = true;
    group.add(lid);

    // Ribbon
    const ribbonMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(accentColor),
      emissive: new THREE.Color(accentColor),
      emissiveIntensity: 0.2,
    });
    const ribbonH = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.08, 0.15), ribbonMat);
    ribbonH.position.y = 1;
    group.add(ribbonH);

    const ribbonV = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 2.05), ribbonMat);
    ribbonV.position.y = 1;
    group.add(ribbonV);

    // Bow
    const bowMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(accentColor),
      emissive: new THREE.Color(accentColor),
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.9,
    });
    for (let i = 0; i < 4; i++) {
      const bow = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.08, 8, 16, Math.PI * 0.6), bowMat);
      bow.position.set(Math.cos(i * Math.PI / 2) * 0.4, 2.35, Math.sin(i * Math.PI / 2) * 0.4);
      bow.rotation.x = Math.PI / 3;
      bow.rotation.y = i * Math.PI / 2;
      bow.rotation.z = Math.PI / 4;
      group.add(bow);
    }

    // Floating particles
    const particleCount = 30;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 8;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 6 + 1;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      particleSizes[i] = 0.03 + Math.random() * 0.05;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      size: 0.04,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    // Ground shadow plane
    const shadowMat = new THREE.MeshPhongMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.1,
    });
    const shadow = new THREE.Mesh(new THREE.CircleGeometry(2.5, 32), shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.01;
    group.add(shadow);

    scene.add(group);

    // Lights
    const ambient = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(ambient);

    const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
    light1.position.set(5, 10, 7);
    light1.castShadow = true;
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0x8888ff, 0.3);
    light2.position.set(-3, 2, -5);
    scene.add(light2);

    const light3 = new THREE.PointLight(color, 0.5, 10);
    light3.position.set(0, 3, 0);
    scene.add(light3);

    // Animation
    const animate = () => {
      group.rotation.y += 0.008;
      group.position.y = Math.sin(Date.now() * 0.001) * 0.15;
      lid.position.y = 2.15 + Math.sin(Date.now() * 0.002) * 0.05;

      (group.children[group.children.length - 2] as THREE.Points).rotation.y += 0.002;

      renderer.render(scene, camera);
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Resize
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight || 300;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [color, accentColor, price, packageName]);

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} style={{ width: '100%', height: '300px' }} />
      {/* Price Tag Overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-lg border border-gray-100">
        <span className="text-sm font-bold text-gray-800">${price}</span>
        <span className="text-xs text-gray-500 ml-1">/package</span>
      </div>
    </div>
  );
}
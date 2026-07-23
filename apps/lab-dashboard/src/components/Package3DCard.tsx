import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Package3DCardProps {
  className?: string;
  name?: string;
  price?: number;
  color?: string;
  accentColor?: string;
  height?: number;
}

export default function Package3DCard({
  className = '',
  name = 'Package',
  price = 49,
  color = '#6366f1',
  accentColor = '#8b5cf6',
  height = 280,
}: Package3DCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(3, 2.5, 5);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();

    // 3D Geometric shape - octahedron with glowing edges
    const mainMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.85,
      specular: new THREE.Color(0x444444),
      shininess: 40,
    });

    const mainGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const mainMesh = new THREE.Mesh(mainGeo, mainMat);
    mainMesh.position.y = 1.2;
    mainMesh.castShadow = true;
    group.add(mainMesh);

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentColor),
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const wireMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 0), wireMat);
    wireMesh.position.y = 1.2;
    group.add(wireMesh);

    // Floating rings
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentColor),
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.03, 16, 60), ringMat);
    ring.position.y = 1.2;
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.02, 16, 60), ringMat);
    ring2.position.y = 1.2;
    ring2.rotation.z = Math.PI / 3;
    ring2.rotation.x = Math.PI / 3;
    group.add(ring2);

    // Small orbiting particles
    const particleCount = 20;
    const particleGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * 2;
      pos[i * 3 + 1] = Math.sin(angle) * 0.5 + 1.2;
      pos[i * 3 + 2] = Math.sin(angle) * 2;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(accentColor),
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    // Floating smaller particles
    const floatCount = 50;
    const floatGeo = new THREE.BufferGeometry();
    const floatPos = new Float32Array(floatCount * 3);
    for (let i = 0; i < floatCount; i++) {
      floatPos[i * 3] = (Math.random() - 0.5) * 6;
      floatPos[i * 3 + 1] = (Math.random() - 0.5) * 4 + 1;
      floatPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    floatGeo.setAttribute('position', new THREE.BufferAttribute(floatPos, 3));
    const floatMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.03,
      transparent: true,
      opacity: 0.3,
    });
    const floatParticles = new THREE.Points(floatGeo, floatMat);
    group.add(floatParticles);

    // Ground shadow
    const shadowMat = new THREE.MeshPhongMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.08,
    });
    const shadow = new THREE.Mesh(new THREE.CircleGeometry(2, 32), shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.01;
    group.add(shadow);

    scene.add(group);

    // Lights
    const ambient = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(ambient);

    const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
    light1.position.set(5, 10, 7);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0x8888ff, 0.3);
    light2.position.set(-3, 2, -5);
    scene.add(light2);

    const pointLight = new THREE.PointLight(color, 0.4, 8);
    pointLight.position.set(0, 3, 0);
    scene.add(pointLight);

    // Animation
    const animate = () => {
      const t = Date.now() * 0.001;
      mainMesh.rotation.x += 0.005;
      mainMesh.rotation.y += 0.01;
      wireMesh.rotation.x = mainMesh.rotation.x;
      wireMesh.rotation.y = mainMesh.rotation.y;

      ring.rotation.z += 0.005;
      ring2.rotation.x += 0.003;
      ring2.rotation.y += 0.004;

      particles.rotation.y += 0.008;
      (group.children[group.children.length - 2] as THREE.Points).rotation.y += 0.002;

      group.position.y = Math.sin(t * 0.8) * 0.1;

      renderer.render(scene, camera);
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
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
  }, [color, accentColor, price, name, height]);

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} style={{ width: '100%', height: `${height}px` }} />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-lg border border-gray-100">
        <span className="text-sm font-bold text-gray-800">${price}</span>
        <span className="text-xs text-gray-500 ml-1">/package</span>
      </div>
    </div>
  );
}
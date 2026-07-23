import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface DataViz3DProps {
  className?: string;
  data?: { label: string; value: number; color?: string }[];
  height?: number;
  type?: 'bars' | 'pie' | 'ring';
}

export default function DataViz3D({
  className = '',
  data = [
    { label: 'Jan', value: 65, color: '#6366f1' },
    { label: 'Feb', value: 45, color: '#8b5cf6' },
    { label: 'Mar', value: 78, color: '#06b6d4' },
    { label: 'Apr', value: 55, color: '#10b981' },
    { label: 'May', value: 92, color: '#f59e0b' },
    { label: 'Jun', value: 70, color: '#ef4444' },
  ],
  height = 300,
  type = 'bars',
}: DataViz3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    const maxVal = Math.max(...data.map(d => d.value));
    const barWidth = 0.6;
    const spacing = 0.8;
    const totalWidth = data.length * (barWidth + spacing) - spacing;
    const startX = -totalWidth / 2 + barWidth / 2;

    // Ground plane
    const groundMat = new THREE.MeshPhongMaterial({
      color: 0x1e1b4b,
      transparent: true,
      opacity: 0.05,
      side: THREE.DoubleSide,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(totalWidth + 2, 3), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    group.add(ground);

    // Bars
    const bars: THREE.Mesh[] = [];
    data.forEach((item, i) => {
      const normalizedHeight = (item.value / maxVal) * 2.5;
      const color = new THREE.Color(item.color || '#6366f1');

      const barMat = new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.15,
        specular: new THREE.Color(0x444444),
        shininess: 30,
        transparent: true,
        opacity: 0.85,
      });

      const bar = new THREE.Mesh(new THREE.BoxGeometry(barWidth, normalizedHeight, barWidth), barMat);
      bar.position.set(startX + i * (barWidth + spacing), normalizedHeight / 2, 0);
      bar.castShadow = true;
      bar.receiveShadow = true;
      (bar as any)._targetHeight = normalizedHeight;
      (bar as any)._currentHeight = 0.01;
      (bar as any)._index = i;

      // Glow edge
      const edgeMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.3,
      });
      const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(barWidth, normalizedHeight, barWidth));
      const edgeLine = new THREE.LineSegments(edges, edgeMat);
      bar.add(edgeLine);

      bars.push(bar);
      group.add(bar);

      // Label below bar
      // Using a sprite for the label would require canvas textures, skip for now
    });

    // Center the group
    camera.position.set(0, 2.5, 5);
    camera.lookAt(0, 0.5, 0);

    scene.add(group);

    // Lights
    const ambient = new THREE.AmbientLight(0x404060, 0.6);
    scene.add(ambient);

    const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
    light1.position.set(5, 10, 7);
    light1.castShadow = true;
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0x8888ff, 0.3);
    light2.position.set(-3, 2, -5);
    scene.add(light2);

    const pointLight = new THREE.PointLight(0x6366f1, 0.5, 10);
    pointLight.position.set(0, 3, 2);
    scene.add(pointLight);

    // Animation
    let startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      // Animate bars growing
      bars.forEach((bar, i) => {
        const delay = i * 0.15;
        const progress = Math.min((elapsed - delay) / 1.0, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const targetHeight = (bar as any)._targetHeight;
        (bar as any)._currentHeight = targetHeight * eased;
        bar.scale.y = eased;
        bar.position.y = (targetHeight * eased) / 2;

        // Gentle floating
        bar.position.y += Math.sin(elapsed * 0.5 + i) * 0.02;
      });

      // Slow rotation
      group.rotation.y = Math.sin(elapsed * 0.1) * 0.2;

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
  }, [data, height, type]);

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} style={{ width: '100%', height: `${height}px` }} />
      {/* Labels */}
      <div className="flex justify-between px-4 mt-2">
        {data.map((item, i) => (
          <div key={i} className="text-center">
            <div className="text-xs text-gray-500 font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
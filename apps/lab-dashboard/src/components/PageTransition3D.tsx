import { useState, useEffect, useRef, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransition3DProps {
  children: ReactNode;
}

export default function PageTransition3D({ children }: PageTransition3DProps) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState('enter');
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPathRef.current) {
      // Start exit animation
      setTransitionStage('exit');
      setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage('enter');
        prevPathRef.current = location.pathname;
      }, 300);
    }
  }, [location.pathname, children]);

  const getTransform = () => {
    switch (transitionStage) {
      case 'enter':
        return 'translateY(0) scale(1) rotateX(0deg)';
      case 'exit':
        return 'translateY(-20px) scale(0.95) rotateX(3deg)';
      default:
        return 'translateY(20px) scale(0.98) rotateX(-2deg)';
    }
  };

  return (
    <div
      style={{
        opacity: transitionStage === 'enter' ? 1 : 0,
        transform: getTransform(),
        filter: transitionStage === 'enter' ? 'blur(0px)' : 'blur(4px)',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        perspective: '1200px',
      }}
    >
      {displayChildren}
    </div>
  );
}
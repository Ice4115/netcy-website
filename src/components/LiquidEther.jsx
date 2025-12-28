'use client';

import { useState, useEffect } from 'react';
import LiquidEtherMobile from './LiquidEther_mobile_complete';

/**
 * @param {Object} props
 * @param {number} [props.mouseForce]
 * @param {number} [props.cursorSize]
 * @param {boolean} [props.isViscous]
 * @param {number} [props.viscous]
 * @param {number} [props.iterationsViscous]
 * @param {number} [props.iterationsPoisson]
 * @param {number} [props.dt]
 * @param {boolean} [props.BFECC]
 * @param {number} [props.resolution]
 * @param {boolean} [props.isBounce]
 * @param {string[]} [props.colors]
 * @param {Object} [props.style]
 * @param {string} [props.className]
 * @param {boolean} [props.autoDemo]
 * @param {number} [props.autoSpeed]
 * @param {number} [props.autoIntensity]
 * @param {number} [props.takeoverDuration]
 * @param {number} [props.autoResumeDelay]
 * @param {number} [props.autoRampDuration]
 */
export default function LiquidEther(props) {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [DesktopComponent, setDesktopComponent] = useState(null);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth <= 1024;
      const mobile = isMobileDevice || isSmallScreen;
      setIsMobile(mobile);
      
      if (!mobile && !DesktopComponent) {
        import('./LiquidEtherDesktop').then(mod => {
          setDesktopComponent(() => mod.default);
        });
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [DesktopComponent]);

  if (!isClient) {
    return (
      <div 
        className={`liquid-ether-container ${props.className || ''}`} 
        style={props.style}
      />
    );
  }

  if (isMobile) {
    return <LiquidEtherMobile {...props} />;
  }

  if (!DesktopComponent) {
    return (
      <div 
        className={`liquid-ether-container ${props.className || ''}`} 
        style={props.style}
      />
    );
  }

  const Desktop = DesktopComponent;
  return <Desktop {...props} />;
}

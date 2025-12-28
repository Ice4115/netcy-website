import { ReactNode, CSSProperties } from 'react';

interface LogoItem {
  src: string;
  alt: string;
  title?: string;
  height?: number;
}

interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  width?: string | number;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  renderItem?: (item: LogoItem, index: string) => ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

declare function LogoLoop(props: LogoLoopProps): JSX.Element;
export default LogoLoop;

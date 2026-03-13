'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type MonitorProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    screen: {
      initial: {
        scaleY: 1,
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
      animate: {
        scaleY: [1, 0.92, 1],
        transition: { duration: 0.4, ease: 'easeInOut' },
      },
    },
    stand: {
      initial: {
        scaleX: 1,
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
      animate: {
        scaleX: [1, 1.1, 1],
        transition: { duration: 0.4, ease: 'easeInOut', delay: 0.1 },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: MonitorProps) {
  const { controls } = useAnimateIconContext();
  const variants = getVariants(animations);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <motion.rect
        width={20}
        height={14}
        x={2}
        y={3}
        rx={2}
        variants={variants.screen}
        initial="initial"
        animate={controls}
        style={{ transformOrigin: '12px 10px' }}
      />
      <motion.path
        d="M8 21h8M12 17v4"
        variants={variants.stand}
        initial="initial"
        animate={controls}
        style={{ transformOrigin: '12px 19px' }}
      />
    </motion.svg>
  );
}

function Monitor(props: MonitorProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Monitor,
  Monitor as MonitorIcon,
  type MonitorProps,
  type MonitorProps as MonitorIconProps,
};

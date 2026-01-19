'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type MessageCircleProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    path: {
      initial: {
        scale: 1,
      },
      animate: {
        scale: [1, 1.05, 1],
        transition: {
          duration: 0.6,
          ease: 'easeInOut',
        },
      },
    },
    dots: {
      initial: {
        y: 0,
      },
      animate: {
        y: [0, -2, 0],
        transition: {
          duration: 0.6,
          ease: 'easeInOut',
          delay: 0.1,
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: MessageCircleProps) {
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
      <motion.path
        d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"
        variants={variants.path}
        initial="initial"
        animate={controls}
      />
      <motion.g
        variants={variants.dots}
        initial="initial"
        animate={controls}
      >
        <circle cx={8} cy={12} r={1} fill="currentColor" />
        <circle cx={12} cy={12} r={1} fill="currentColor" />
        <circle cx={16} cy={12} r={1} fill="currentColor" />
      </motion.g>
    </motion.svg>
  );
}

function MessageCircle(props: MessageCircleProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  MessageCircle,
  MessageCircle as MessageCircleIcon,
  type MessageCircleProps,
  type MessageCircleProps as MessageCircleIconProps,
};

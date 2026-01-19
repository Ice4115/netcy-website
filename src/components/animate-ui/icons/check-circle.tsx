'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type CheckCircleProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    circle: {
      initial: {
        pathLength: 0,
        opacity: 0,
      },
      animate: {
        pathLength: 1,
        opacity: 1,
        transition: {
          duration: 0.5,
          ease: 'easeInOut',
        },
      },
    },
    path: {
      initial: {
        pathLength: 0,
        opacity: 0,
      },
      animate: {
        pathLength: 1,
        opacity: 1,
        transition: {
          duration: 0.4,
          ease: 'easeInOut',
          delay: 0.3,
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: CheckCircleProps) {
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
        d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
        variants={variants.circle}
        initial="initial"
        animate={controls}
      />
      <motion.polyline
        points="22 4 12 14.01 9 11.01"
        variants={variants.path}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function CheckCircle(props: CheckCircleProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  CheckCircle,
  CheckCircle as CheckCircleIcon,
  type CheckCircleProps,
  type CheckCircleProps as CheckCircleIconProps,
};

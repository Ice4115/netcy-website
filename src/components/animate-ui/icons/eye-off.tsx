'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type EyeOffProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    path: {
      initial: {
        scaleX: 1,
      },
      animate: {
        scaleX: [1, 0.8, 1],
        transition: {
          duration: 0.6,
          ease: 'easeInOut',
        },
      },
    },
    line: {
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
          delay: 0.2,
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: EyeOffProps) {
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
        d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
        variants={variants.path}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
        variants={variants.path}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
        variants={variants.path}
        initial="initial"
        animate={controls}
      />
      <motion.line
        x1={2}
        x2={22}
        y1={2}
        y2={22}
        variants={variants.line}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function EyeOff(props: EyeOffProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  EyeOff,
  EyeOff as EyeOffIcon,
  type EyeOffProps,
  type EyeOffProps as EyeOffIconProps,
};

'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type XProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    line1: {
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
        },
      },
    },
    line2: {
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
          delay: 0.2,
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: XProps) {
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
        d="M18 6 6 18"
        variants={variants.line1}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="m6 6 12 12"
        variants={variants.line2}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function X(props: XProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  X,
  X as XIcon,
  type XProps,
  type XProps as XIconProps,
};

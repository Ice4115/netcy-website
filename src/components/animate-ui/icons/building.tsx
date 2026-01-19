'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type BuildingProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    rect1: {
      initial: {
        y: 0,
      },
      animate: {
        y: [0, -2, 0],
        transition: {
          duration: 0.6,
          ease: 'easeInOut',
        },
      },
    },
    rect2: {
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
    path: {
      initial: {
        scaleY: 1,
      },
      animate: {
        scaleY: [1, 0.95, 1],
        transition: {
          duration: 0.6,
          ease: 'easeInOut',
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: BuildingProps) {
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
        d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"
        variants={variants.path}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"
        variants={variants.rect1}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"
        variants={variants.rect2}
        initial="initial"
        animate={controls}
      />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </motion.svg>
  );
}

function Building(props: BuildingProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Building,
  Building as BuildingIcon,
  type BuildingProps,
  type BuildingProps as BuildingIconProps,
};

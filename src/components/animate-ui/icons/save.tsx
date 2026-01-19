'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type SaveProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    path: {
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
    polyline: {
      initial: {
        scale: 1,
      },
      animate: {
        scale: [1, 0.9, 1],
        transition: {
          duration: 0.6,
          ease: 'easeInOut',
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: SaveProps) {
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
        d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
        variants={variants.path}
        initial="initial"
        animate={controls}
      />
      <motion.polyline
        points="17 21 17 13 7 13 7 21"
        variants={variants.polyline}
        initial="initial"
        animate={controls}
      />
      <motion.polyline
        points="7 3 7 8 15 8"
        variants={variants.polyline}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Save(props: SaveProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Save,
  Save as SaveIcon,
  type SaveProps,
  type SaveProps as SaveIconProps,
};

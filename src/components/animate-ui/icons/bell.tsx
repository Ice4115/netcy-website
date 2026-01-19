'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type BellProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    bell: {
      initial: {
        rotate: 0,
      },
      animate: {
        rotate: [0, -15, 15, -10, 10, -5, 5, 0],
        transition: {
          duration: 0.8,
          ease: 'easeInOut',
        },
      },
    },
    clapper: {
      initial: {
        x: 0,
      },
      animate: {
        x: [0, -1, 1, -1, 1, 0],
        transition: {
          duration: 0.8,
          ease: 'easeInOut',
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: BellProps) {
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
        d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
        variants={variants.bell}
        initial="initial"
        animate={controls}
        style={{ originX: '12px', originY: '12px' }}
      />
      <motion.path
        d="M10.3 21a1.94 1.94 0 0 0 3.4 0"
        variants={variants.clapper}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Bell(props: BellProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Bell,
  Bell as BellIcon,
  type BellProps,
  type BellProps as BellIconProps,
};

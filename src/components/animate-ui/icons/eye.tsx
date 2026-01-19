'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type EyeProps = IconProps<keyof typeof animations>;

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
    circle: {
      initial: {
        scale: 1,
      },
      animate: {
        scale: [1, 1.2, 1],
        transition: {
          duration: 0.6,
          ease: 'easeInOut',
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: EyeProps) {
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
        d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
        variants={variants.path}
        initial="initial"
        animate={controls}
        style={{ originX: '12px', originY: '12px' }}
      />
      <motion.circle
        cx={12}
        cy={12}
        r={3}
        variants={variants.circle}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Eye(props: EyeProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Eye,
  Eye as EyeIcon,
  type EyeProps,
  type EyeProps as EyeIconProps,
};

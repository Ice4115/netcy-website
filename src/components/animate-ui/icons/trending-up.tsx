'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type TrendingUpProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    polyline: {
      initial: {
        pathLength: 0,
        opacity: 0,
      },
      animate: {
        pathLength: 1,
        opacity: 1,
        transition: {
          duration: 0.8,
          ease: 'easeInOut',
        },
      },
    },
    arrow: {
      initial: {
        pathLength: 0,
        opacity: 0,
      },
      animate: {
        pathLength: 1,
        opacity: 1,
        transition: {
          duration: 0.6,
          ease: 'easeInOut',
          delay: 0.3,
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: TrendingUpProps) {
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
      <motion.polyline
        points="23 6 13.5 15.5 8.5 10.5 1 18"
        variants={variants.polyline}
        initial="initial"
        animate={controls}
      />
      <motion.polyline
        points="17 6 23 6 23 12"
        variants={variants.arrow}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function TrendingUp(props: TrendingUpProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  TrendingUp,
  TrendingUp as TrendingUpIcon,
  type TrendingUpProps,
  type TrendingUpProps as TrendingUpIconProps,
};

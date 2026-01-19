'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type PercentProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    line: {
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
        },
      },
    },
    circle1: {
      initial: {
        scale: 0,
      },
      animate: {
        scale: 1,
        transition: {
          duration: 0.4,
          ease: 'easeOut',
        },
      },
    },
    circle2: {
      initial: {
        scale: 0,
      },
      animate: {
        scale: 1,
        transition: {
          duration: 0.4,
          ease: 'easeOut',
          delay: 0.2,
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: PercentProps) {
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
      <motion.line
        x1={19}
        y1={5}
        x2={5}
        y2={19}
        variants={variants.line}
        initial="initial"
        animate={controls}
      />
      <motion.circle
        cx={6.5}
        cy={6.5}
        r={2.5}
        variants={variants.circle1}
        initial="initial"
        animate={controls}
      />
      <motion.circle
        cx={17.5}
        cy={17.5}
        r={2.5}
        variants={variants.circle2}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Percent(props: PercentProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Percent,
  Percent as PercentIcon,
  type PercentProps,
  type PercentProps as PercentIconProps,
};

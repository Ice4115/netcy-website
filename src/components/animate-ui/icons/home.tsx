'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type HomeProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    path: {
      initial: {
        scale: 1,
      },
      animate: {
        scale: [1, 1.1, 1],
        transition: {
          duration: 0.6,
          ease: 'easeInOut',
        },
      },
    },
    door: {
      initial: {
        scaleY: 1,
      },
      animate: {
        scaleY: [1, 0.8, 1],
        transition: {
          duration: 0.6,
          ease: 'easeInOut',
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: HomeProps) {
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
        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        variants={variants.path}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M9 22V12h6v10"
        variants={variants.door}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Home(props: HomeProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Home,
  Home as HomeIcon,
  type HomeProps,
  type HomeProps as HomeIconProps,
};

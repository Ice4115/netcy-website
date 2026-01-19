'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type MailProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    rect: {
      initial: {
        scale: 1,
      },
      animate: {
        scale: [1, 1.05, 1],
        transition: {
          duration: 0.6,
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
          duration: 0.5,
          ease: 'easeInOut',
          delay: 0.2,
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: MailProps) {
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
      <motion.rect
        width={20}
        height={16}
        x={2}
        y={4}
        rx={2}
        variants={variants.rect}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
        variants={variants.path}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Mail(props: MailProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Mail,
  Mail as MailIcon,
  type MailProps,
  type MailProps as MailIconProps,
};

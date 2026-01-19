'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type FileTextProps = IconProps<keyof typeof animations>;

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
    line1: {
      initial: {
        x: 0,
      },
      animate: {
        x: [0, 2, 0],
        transition: {
          duration: 0.6,
          ease: 'easeInOut',
          delay: 0.1,
        },
      },
    },
    line2: {
      initial: {
        x: 0,
      },
      animate: {
        x: [0, 2, 0],
        transition: {
          duration: 0.6,
          ease: 'easeInOut',
          delay: 0.2,
        },
      },
    },
    line3: {
      initial: {
        x: 0,
      },
      animate: {
        x: [0, 2, 0],
        transition: {
          duration: 0.6,
          ease: 'easeInOut',
          delay: 0.3,
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: FileTextProps) {
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
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        variants={variants.path}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M14 2v6h6"
        variants={variants.path}
        initial="initial"
        animate={controls}
      />
      <motion.line
        x1={16}
        y1={13}
        x2={8}
        y2={13}
        variants={variants.line1}
        initial="initial"
        animate={controls}
      />
      <motion.line
        x1={16}
        y1={17}
        x2={8}
        y2={17}
        variants={variants.line2}
        initial="initial"
        animate={controls}
      />
      <motion.line
        x1={10}
        y1={9}
        x2={8}
        y2={9}
        variants={variants.line3}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function FileText(props: FileTextProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  FileText,
  FileText as FileTextIcon,
  type FileTextProps,
  type FileTextProps as FileTextIconProps,
};

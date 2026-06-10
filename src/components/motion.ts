import React from 'react';
import { motion, type MotionProps } from 'framer-motion';

// framer-motion v10 types break under @types/react v19 — cast to recover HTML attrs
export const MotionDiv = motion.div as unknown as React.ComponentType<
  MotionProps & React.HTMLAttributes<HTMLDivElement> & { style?: React.CSSProperties }
>;

export const MotionButton = motion.button as unknown as React.ComponentType<
  MotionProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { style?: React.CSSProperties }
>;

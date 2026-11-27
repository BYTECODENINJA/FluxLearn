"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import * as React from "react";

interface FadeUpProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  delay?: number;
  distance?: number;
  duration?: number;
  /** "mount" runs on first render; "in-view" runs when the element scrolls into view (once). */
  trigger?: "mount" | "in-view";
}

export const FadeUp = React.forwardRef<HTMLDivElement, FadeUpProps>(
  function FadeUp(
    {
      delay = 0,
      distance = 0,
      duration = 0.18,
      trigger = "mount",
      children,
      ...rest
    }: FadeUpProps,
    ref
  ) {
    const prefersReducedMotion = useReducedMotion();
    // `initial` must be identical on the server and in the browser, or
    // hydration fails for readers who prefer reduced motion (the server can't
    // know the setting). Reduced motion instead skips the transition; the
    // content appears at once, with no movement.
    const initial = { opacity: 0, y: distance };
    const animate = { opacity: 1, y: 0 };
    const transition = prefersReducedMotion
      ? { duration: 0, delay: 0 }
      : { duration, delay, ease: [0.2, 0.8, 0.2, 1] as const };

    if (trigger === "in-view") {
      return (
        <motion.div
          ref={ref}
          initial={initial}
          whileInView={animate}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={transition}
          {...rest}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={ref}
        initial={initial}
        animate={animate}
        transition={transition}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }
);

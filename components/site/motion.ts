export type RevealMotionProps = {
  initial: Record<string, number>;
  whileInView: Record<string, number>;
  transition: {
    duration: number;
    delay?: number;
    ease: [number, number, number, number];
  };
  viewport: {
    once: boolean;
    amount: number;
  };
};

export function reveal(reduceMotion: boolean, delay = 0): RevealMotionProps {
  if (reduceMotion) {
    return {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      transition: { duration: 0.28, delay, ease: [0.2, 0.7, 0.2, 1] },
      viewport: { once: true, amount: 0.2 }
    };
  }

  return {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.42, delay, ease: [0.2, 0.7, 0.2, 1] },
    viewport: { once: true, amount: 0.2 }
  };
}

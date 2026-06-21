import { useState, useEffect, useRef } from "react";

/**
 * Custom hook for animated count-up numbers.
 * Triggers when element enters viewport via IntersectionObserver.
 * Falls back to immediate animation if IntersectionObserver fails or times out.
 */
export function useCountUp(end: number, duration = 2000, suffix = "") {
  const [count, setCount] = useState(end); // Start with final value for SSR safety
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Fallback timeout - if IntersectionObserver doesn't trigger within 3 seconds, animate anyway
    timeoutRef.current = setTimeout(() => {
      if (!hasAnimated) {
        startAnimation();
      }
    }, 3000);

    const startAnimation = () => {
      if (hasAnimated) return;
      setHasAnimated(true);
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * end));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          // Clear the timeout since IntersectionObserver worked
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          startAnimation();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [end, duration, hasAnimated]);

  return { count, ref, displayValue: `${count}${suffix}` };
}

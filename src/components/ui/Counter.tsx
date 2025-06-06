import React, { useState, useEffect, useRef } from "react";

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

const Counter: React.FC<CounterProps> = ({
  end,
  duration = 6000,
  suffix = "",
  prefix = "",
  className = "text-4xl font-bold text-blue-600 mb-2",
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCount();
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);

  const animateCount = () => {
    const startTime = Date.now();
    const startValue = 0;

    const updateCount = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;

      if (elapsedTime < duration) {
        const progress = elapsedTime / duration;
        const easedProgress = easeOutQuad(progress);
        const currentCount = Math.floor(
          startValue + easedProgress * (end - startValue)
        );
        setCount(currentCount);
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  };

  const easeOutQuad = (t: number): number => t * (2 - t);

  return (
    <div ref={countRef} className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </div>
  );
};

export default Counter;

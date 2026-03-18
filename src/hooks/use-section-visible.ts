import { useEffect, useRef, useState } from "react";

export const useSectionVisible = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [isVisible]);

  return { ref, isVisible };
};

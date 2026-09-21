"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function ParallaxHero({
  src,
  cutoutSrc,
  alt,
  children,
}: {
  src: string;
  cutoutSrc: string;
  alt: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setOffset(0);
      return;
    }

    let frame = 0;
    const update = () => {
      const node = ref.current;
      if (!node) {
        return;
      }
      setOffset(node.getBoundingClientRect().top * -0.32);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduceMotion]);

  return (
    <section
      ref={ref}
      className="marketing-hero relative flex min-h-[100svh] flex-col overflow-hidden bg-[#efece7] lg:block"
    >
      <div
        className="pointer-events-none absolute -top-[18%] right-[-3%] hidden h-[136%] w-[56%] will-change-transform [mask-image:linear-gradient(to_right,transparent,black_22%)] lg:block"
        style={{
          transform: reduceMotion ? undefined : `translate3d(0, ${offset}px, 0)`,
        }}
      >
        <Image
          src={src}
          alt=""
          fill
          priority
          className="object-cover object-[center_78%]"
          sizes="56vw"
        />
      </div>
      <div className="relative z-10">{children}</div>
      <div className="flex flex-1 items-center justify-center px-6 pb-8 pt-2 lg:hidden">
        <Image
          src={cutoutSrc}
          alt={alt}
          width={2403}
          height={1738}
          priority
          className="h-auto w-full max-h-[46vh] object-contain drop-shadow-[0_22px_32px_rgba(30,24,18,0.16)]"
        />
      </div>
    </section>
  );
}

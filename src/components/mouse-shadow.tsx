"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const SHADOW_SIZE = 150;

const MouseShadow = () => {
  const shadowRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const shadowPos = useRef({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (frame.current === null) {
        frame.current = requestAnimationFrame(updateShadow);
      }
    };

    const updateShadow = () => {
      if (shadowRef.current) {
        const lerp = 0.1;
        shadowPos.current.x += (mouse.current.x - shadowPos.current.x) * lerp;
        shadowPos.current.y += (mouse.current.y - shadowPos.current.y) * lerp;

        const x = shadowPos.current.x - SHADOW_SIZE / 2;
        const y = shadowPos.current.y - SHADOW_SIZE / 2;
        shadowRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      frame.current = requestAnimationFrame(updateShadow);
    };

    window.addEventListener("mousemove", handleMouseMove);
    frame.current = requestAnimationFrame(updateShadow);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = (e: StorageEvent) => {
      if (e.key === "mouse-shadow") {
        const value = e.newValue === "true";
        setIsVisible(value);
      }
    };
    const handleVisibilityChangeCustomEvent = (e: CustomEvent) => {
      if (e.detail.key === "mouse-shadow") {
        const value = e.detail.newValue === "true";
        setIsVisible(value);
      }
    };
    window.addEventListener("storage", handleVisibilityChange);
    window.addEventListener(
      "localStorageChange",
      handleVisibilityChangeCustomEvent as EventListener
    );
    return () => {
      window.removeEventListener("storage", handleVisibilityChange);
      window.removeEventListener(
        "localStorageChange",
        handleVisibilityChangeCustomEvent as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const storage = localStorage.getItem("mouse-shadow");
    const value = storage === "true";
    setIsVisible(value);
  }, []);

  return (
    <>
      <div
        ref={shadowRef}
        className={cn("pointer-events-none fixed", {
          invisible: !isVisible,
        })}
        style={{
          left: 0,
          top: 0,
          opacity: 0.8,
          width: SHADOW_SIZE,
          height: SHADOW_SIZE,
          borderRadius: "50%",
          background: `radial-gradient(circle at 50% 50%, rgba(3, 149, 254, 0.45) 0%, rgba(130, 89, 169, 0.35) 60%, rgba(254, 30, 87, 0.25) 100%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
          mixBlendMode: "lighten",
        }}
      ></div>
    </>
  );
};

export default MouseShadow;

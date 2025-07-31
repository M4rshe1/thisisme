"use client";

import { useEffect, useState } from "react";

const AcrylicBackground = () => {
  const [acrylicAnimation, setAcrylicAnimation] = useState(true);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "acrylic-animation") {
        const value = e.newValue !== "false"; // Default to true
        setAcrylicAnimation(value);
      }
    };

    const handleCustomEvent = (e: CustomEvent) => {
      if (e.detail.key === "acrylic-animation") {
        const value = e.detail.newValue !== "false"; // Default to true
        setAcrylicAnimation(value);
      }
    };

    // Get initial value
    const storage = localStorage.getItem("acrylic-animation");
    const value = storage !== "false"; // Default to true
    setAcrylicAnimation(value);

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "localStorageChange",
      handleCustomEvent as EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "localStorageChange",
        handleCustomEvent as EventListener
      );
    };
  }, []);

  return (
    <div
      className={`h-full w-full acrylic-bg min-h-screen bg-opacity-10 -z-10 col-start-1 row-start-1 ${
        !acrylicAnimation ? "no-animation" : ""
      }`}
    />
  );
};

export default AcrylicBackground;

"use client"

import React, {useEffect, useState} from "react";
import {ChevronsUp} from "lucide-react";
import {cn} from "@/lib/utils";

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when page is scrolled half of viewport height
            if (window.scrollY > window.innerHeight / 2) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);


    return (
        <button
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            className={cn("bottom-8 right-8 border border-gray-600 text-white shadow-lg bg-black/30 backdrop-blur-sm z-50 px-2 py-2 rounded-lg transition-all cursor-pointer hover:border-gray-400 hover:bg-black/50",
                {
                    "fixed": isVisible,
                    "hidden": !isVisible,
                })}
        >
            <ChevronsUp/>
        </button>
    );
}

export default BackToTop;
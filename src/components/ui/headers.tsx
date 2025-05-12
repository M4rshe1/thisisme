import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import Dot from "@/components/dot";

export function Description({ children, ...props }: ComponentProps<"p">) {
    return (
        <p {...props} className={cn("text-neutral-400", props.className)}>
            {children}
        </p>
    );
}

export function Header1({ children, ...props }: ComponentProps<"h1">) {
    return (
        <h1 {...props} className={cn("mb-2 scroll-mt-20 box-decoration-clone bg-clip-text text-3xl font-black tracking-[-0.03em] text-gray-200 motion-reduce:transition-none", props.className)}>
            {children}
            <Dot className={"ml-1.5"}/>
        </h1>
    );
}

export function Header2({ children, ...props }: ComponentProps<"h2">) {
    return (
        <h2 {...props} className={cn("mb-2 scroll-mt-20 text-gray-200 box-decoration-clone bg-clip-text text-[1.7rem] font-[750] motion-reduce:transition-none", props.className)}>
            {children}
            <Dot className={"ml-1.5"}/>
        </h2>
    );
}
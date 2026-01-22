"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Heading = {
  size: number;
  content: string;
  slug: string;
};

type BlogTOCProps = {
  headings: Heading[];
  tableOfContentsLabel: string;
  variant?: "desktop" | "mobile";
};

export function BlogTOC({ headings, tableOfContentsLabel, variant = "desktop" }: BlogTOCProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe all heading elements
    headings.forEach((heading) => {
      const element = document.getElementById(heading.slug);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.slug);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    const element = document.getElementById(slug);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update URL without triggering scroll
      window.history.pushState(null, "", `#${slug}`);
    }
  };

  console.log(headings);

  const navContent = (
    <nav className="flex flex-col space-y-1">
      {headings.map((props) => (
        <Link
          key={props.slug}
          href={`#${props.slug}`}
          scroll={false}
          onClick={(e) => handleLinkClick(e, props.slug)}
          className={cn(
            "font-normal no-underline text-neutral-600 dark:text-neutral-400 duration-200 hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline motion-reduce:transition-none py-1 transition-colors",
            {
              // H1 - No indent
              "ml-0 ": props.size === 1,
              // H2 - Small indent
              "ml-3 text-sm": props.size === 2,
              // H3 - Medium indent
              "ml-6 text-sm": props.size === 3,
              // H4 - Large indent
              "ml-9 text-sm": props.size === 4,
              // H5 - Extra large indent
              "ml-12 text-sm": props.size === 5,
              // H6 - Extra large indent
              "ml-15 text-sm": props.size === 6,
              // Active state
              "text-neutral-900 dark:text-neutral-100 font-semibold": activeId === props.slug,
            }
          )}
        >
          {props.content}
        </Link>
      ))}
    </nav>
  );

  if (variant === "mobile") {
    return (
      <aside className="lg:hidden mt-8 mb-8 w-full">
        <div className="border-t-2 border-neutral-300 dark:border-neutral-700 pt-6">
          <p className="mb-4 text-sm font-semibold uppercase text-neutral-600 dark:text-neutral-400">
            {tableOfContentsLabel}
          </p>
          {navContent}
        </div>
      </aside>
    );
  }

  return (
    <aside className="fixed right-8 w-64 z-10">
      <div className="sticky top-24 pt-8">
        <div className="border-r-2 border-neutral-300 dark:border-neutral-700 pr-6">
          <p className="mb-4 text-sm font-semibold uppercase text-neutral-600 dark:text-neutral-400">
            {tableOfContentsLabel}
          </p>
          {navContent}
        </div>
      </div>
    </aside>
  );
}

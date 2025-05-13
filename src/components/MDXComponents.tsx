import rehypePrism from 'rehype-prism-plus'
import rehypeCodeTitles from 'rehype-code-titles'
import type {MDXComponents} from "mdx/types";
import Image, {ImageProps} from "next/image";
import type {LinkProps} from "next/link";
import {MDXRemote} from "next-mdx-remote/rsc";
import React from "react";
import {Link} from "@/i18n/navigation";
import {cn, slugify} from "@/lib/utils";
import TechnologyBadge from "@/components/technology-badge";

function createHeading(level: number) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line react/display-name
    return ({children}) => {
        const slug = slugify(children);
        return React.createElement(`h${level}`, {
            id: slug, className: cn("font-bold mb-2 mt-4", {
                "group": level !== 1,
                "text-2xl": level === 1,
                "text-xl": level === 2,
                "text-lg": level === 3,
                "text-base": level === 4,
                "text-sm": level === 5,
                "text-xs": level === 6,
            })
        }, [
            <Link href={`#${slug}`} key={`link-${slug}`} scroll className={cn("anchor")}>
                <span className="absolute -left-5 top-0 text-lg opacity-0 group-hover:opacity-100">#</span>
            </Link>
        ], children);
    };
}

const components: MDXComponents = {
    // eslint-disable-next-line jsx-a11y/alt-text
    Image: (props: ImageProps) => <Image className="rounded-lg" {...props} />,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    a: (props: LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) => <Link
        className="underline decoration-2 decoration-dotted underline-offset-4 hover:decoration-solid text-primary"
        {...props} />,
    h1: createHeading(1),
    h2: createHeading(2),
    h3: createHeading(3),
    h4: createHeading(4),
    h5: createHeading(5),
    h6: createHeading(6),
    strong: ({children}) => <strong className="font-bold text-red-400">{children}</strong>,
    em: ({children}) => <em className="text-yellow-300">{children}</em>,
    pre: ({children, ...props}: { children: React.ReactNode }) => {
        const language = (props as any)?.className?.split('-')[1] || 'text';
        return (
            <pre className="rounded-md p-4 bg-black/30 w-full overflow-x-auto my-4 border border-gray-600 relative">
                <div className="absolute top-2 right-2 px-2 py-1 rounded bg-white/30 text-xs font-mono">
                    {language}
                </div>
                <div>
                    {children}
                </div>
            </pre>
        );
    },
    blockquote: ({children}) => {
        const newChildren = React.Children.map(children, (child) => {
            if (typeof child === 'string') {
                return child.replace(/\n/g, '');
            }
            return child;
        });

        return <blockquote
            className="border-gray-600 pl-4 before:content-[''] before:absolute before:-left-0 before:rounded-full before:top-0 before:h-full before:w-1 before:bg-gray-600 relative bg-gray-800/30 rounded p-2 my-4">
            <pre className={"h-fit"}>
            {newChildren}
            </pre>
        </blockquote>
    },
};

export function MDXComponent(
    props: React.ComponentPropsWithoutRef<typeof MDXRemote>,
) {
    return (
        <div
            className="prose prose-neutral prose-a:underline-offset-6 max-w-5xl prose-a:hover:underline-offset-auto prose-img:m-0 prose-a:font-bold prose-a:hover:decoration-wavy flex flex-col [&>*]:w-fit [&>pre]:w-full [&>blockquote]:w-full"
        >
            <MDXRemote
                {...props}
                components={{
                    ...components,
                    TechnologyBadge, // Pass the TechnologyBadge component here
                    ...(props.components || {}),
                }}
                options={{
                    mdxOptions: {
                        format: "mdx",
                        rehypePlugins: [rehypeCodeTitles, rehypePrism],
                    },
                }}
            />
        </div>
    );
}

import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {MDXComponent} from "@/components/MDXComponents";
import {Header1} from "@/components/ui/headers";
import {Link} from "@/i18n/navigation"
import {getBlogPosts} from "@/lib/blogUtils";
import {cn, parseISO} from "@/lib/utils";
import {getTranslations} from "next-intl/server";
import Image from "next/image";

type Props = {
    params: Promise<{ slug: string, locale: string }>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug, locale} = await params;
    const post = (await getBlogPosts(locale)).find((post) => post.slug === slug);

    if (!post) return {};

    const {title, publishedAt: publishedTime, summary: description, image} = post.metadata;

    return {
        title: `${title} | ${post.metadata.author} | ${post.metadata.publishedAt}`,
        description,
        openGraph: {
            images: image ? `${URL}/${image}` : `/og?title=${encodeURIComponent(title)}`,
            title,
            description,
            type: "article",
            publishedTime,
            url: `${URL}/blog/${post.slug}`,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default async function Blog({params}: Props) {
    const {slug, locale} = await params;
    const post = (await getBlogPosts(locale)).find((post) => post.slug === slug);
    const t = await getTranslations("blog");
    if (!post) notFound();

    return (
        <article
            className="mt-6 mb-16 flex min-h-screen flex-col items-start justify-center md:mt-12 lg:mt-20 max-w-5xl">
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        headline: post.metadata.title,
                        datePublished: post.metadata.publishedAt,
                        dateModified: post.metadata.publishedAt,
                        description: post.metadata.summary,
                        image: post.metadata.image ? `${URL}${post.metadata.image}` : `/og?title=${encodeURIComponent(post.metadata.title)}`,
                        url: `${URL}/blog/${post.slug}`,
                        author: {
                            "@type": "Person",
                            name: post.metadata.author,
                        },
                    }),
                }}
            />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(auto,640px)_256px]">
                    <div>
                        {
                            post.metadata.image &&
                            <div className="relative mb-6 h-96 w-full overflow-hidden rounded-lg">
                                <Image
                                    src={post.metadata.image}
                                    alt={post.metadata.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        }
                        <div className="mb-6 w-full">
                            <Header1>{post.metadata.title}</Header1>
                            <div className="mt-4 flex w-full flex-col items-start justify-between md:flex-row md:items-center">
                                <div className="flex items-center">
                                    {/*<Image alt={meta.title} height={24} width={24} src={} className="rounded-full" />*/}
                                    <time className="ml-2 text-sm text-neutral-700 dark:text-neutral-300"
                                          dateTime={new Date(post.metadata.publishedAt).toUTCString()}>
                                        {post.metadata.author} / {parseISO(post.metadata.publishedAt, locale)}
                                    </time>
                                </div>
                                <p className="mt-2 min-w-32 text-sm text-neutral-700 md:mt-0 dark:text-neutral-300">
                                    {post.wordCount} {t("words")} • {Math.round((post.readingTime?.time || 1) / 1000 / 60)} min {t("read")}
                                </p>
                            </div>
                        </div>
                        <MDXComponent source={post.content}/>
                    </div>
                    <aside className="order-first lg:order-none">
                        <div className="lg:sticky lg:top-24 flex flex-col space-y-2">
                            <p className="mb-2 text-sm uppercase">{t("tableOfContents")}</p>
                            {post.headings &&
                                post.headings.map((props: { size: number; content: string; slug: string }) => (
                                    <Link
                                        key={props.slug}
                                        href={`#${props.slug}`}
                                        scroll={true}
                                        className={cn(
                                            {
                                                "ml-2": props.size === 2,
                                                "ml-4": props.size === 3,
                                                "ml-6": props.size === 4,
                                                "ml-8": props.size === 5,
                                                "ml-10": props.size === 6,
                                            },
                                            "font-normal! no-underline opacity-50 duration-200 hover:underline hover:opacity-100 motion-reduce:transition-none"
                                        )}
                                    >
                                        {props.content}
                                    </Link>
                                ))}
                        </div>
                    </aside>
                </div>
        </article>
    );
}
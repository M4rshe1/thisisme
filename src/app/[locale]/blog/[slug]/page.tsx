import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXComponent } from "@/components/MDXComponents";
import { Header1 } from "@/components/ui/headers";
import { getBlogPosts } from "@/lib/blogUtils";
import { cn, parseISO } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { BlogTOC } from "@/components/blog-toc";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = (await getBlogPosts(locale)).find((post) => post.slug === slug);

  if (!post) return {};

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;

  return {
    title: `${title} | ${post.metadata.author} | ${post.metadata.publishedAt}`,
    description,
    openGraph: {
      images: image
        ? `${URL}/${image}`
        : `/og?title=${encodeURIComponent(title)}`,
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

export default async function Blog({ params }: Props) {
  const { slug, locale } = await params;
  const post = (await getBlogPosts(locale)).find((post) => post.slug === slug);
  const t = await getTranslations("blog");
  if (!post) notFound();

  return (
    <div className="relative flex lg:w-3/4 xl:w-full min-h-screen mx-auto"  id="top-of-page">
      <article className="flex-1 w-full max-w-none mt-6 mb-16 flex flex-col items-start justify-center md:mt-12 lg:mt-20 px-4 relative">
      {post.headings && post.headings.length > 0 && (
        <div className="hidden xl:block">
          <BlogTOC headings={post.headings} tableOfContentsLabel={t("tableOfContents")} variant="desktop" />
        </div>
      )}
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
              image: post.metadata.image
                ? `${URL}${post.metadata.image}`
                : `/og?title=${encodeURIComponent(post.metadata.title)}`,
              url: `${URL}/blog/${post.slug}`,
              author: {
                "@type": "Person",
                name: post.metadata.author,
              },
            }),
          }}
        />
        {post.metadata.image && (
          <div className="relative mb-6 h-96 w-full overflow-hidden rounded-lg">
            <Image
              src={post.metadata.image}
              alt={post.metadata.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        {post.headings && post.headings.length > 0 && (
          <div className="block lg:hidden mb-4">
            <BlogTOC headings={post.headings} tableOfContentsLabel={t("tableOfContents")} variant="mobile" />
          </div>
        )}
        <div className="mb-6 w-full">
          <Header1>{post.metadata.title}</Header1>
          <div className="mt-4 flex w-full flex-col items-start justify-between md:flex-row md:items-center">
            <div className="flex items-center">
              {/*<Image alt={meta.title} height={24} width={24} src={} className="rounded-full" />*/}
              <time
                className="ml-2 text-sm text-neutral-700 dark:text-neutral-300"
                dateTime={new Date(post.metadata.publishedAt).toUTCString()}
              >
                {post.metadata.author} /{" "}
                {parseISO(post.metadata.publishedAt, locale)}
              </time>
            </div>
            <p className="mt-2 min-w-32 text-sm text-neutral-700 md:mt-0 dark:text-neutral-300">
              {post.wordCount} {t("words")} •{" "}
              {Math.round((post.readingTime?.time || 1) / 1000 / 60)} min{" "}
              {t("read")}
            </p>
          </div>
        </div>
        <MDXComponent source={post.content} />
      </article>
    </div>
  );
}

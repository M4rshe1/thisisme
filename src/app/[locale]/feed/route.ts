import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/blogUtils";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-static";

export async function GET({params}: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations("meta");
    const posts = getBlogPosts(locale);

    const updatedDate = posts.length ? new Date(Math.max(...posts.map((post) => new Date(post.metadata.publishedAt).getTime()))).toISOString() : new Date().toISOString();

    const entries = posts
        .map(
            (post) => `
        <entry>
          <id>${URL}/blog/${post.slug}</id>
          <title>${post.metadata.title}</title>
          <summary>${post.metadata.summary}</summary>
          <link href="${URL}/${locale}/blog/${post.slug}"/>
          <updated>${new Date(post.metadata.publishedAt).toISOString()}</updated>
        </entry>`
        )
        .join("");

    return new NextResponse(
        `<?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>${t("title")}</title>
      <subtitle>Blog</subtitle>
      <link href="${URL}/feed" rel="self"/>
      <link href="${URL}/"/>
      <updated>${updatedDate}</updated>
      <author>
        <name>${t("author")}</name>
      </author>
      <id>${URL}/</id>
      ${entries}
    </feed>`,
        {
            headers: {
                "content-type": "application/atom+xml; charset=utf-8",
            },
        }
    );
}
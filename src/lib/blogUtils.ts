"use server";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { slugify } from "@/lib/utils";

export type BlogPostMetadata = {
    title: string;
    publishedAt: string;
    author: string;
    summary: string;
    tags?: string[];
    image: string;
    link?: string;
    linkText?: string;
};

export type OtherPageMetadata = {
    title: string;
    description: string;
};

const headersRegex = /^(#{1,6})\s+(.*)$/gm;
const fencedCodeBlockRegex = /```[\s\S]*?```/g;

function parseFrontmatter<T>(fileContent: string): { metadata: T; content: string } {
    const { data: metadata, content } = matter(fileContent);
    return { metadata: metadata as T, content: content.trim() };
}

function getMDXFiles(dir: string) {
    return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile<T>(filePath: string): { metadata: T; content: string } {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    return parseFrontmatter<T>(rawContent);
}

function getMDXData<T>(dir: string): Array<{
    metadata: T;
    slug: string;
    content: string;
    wordCount: number;
    readingTime?: ReturnType<typeof readingTime>;
    headings?: Array<{ size: number; content: string; slug: string }>;
}> {
    const mdxFiles = getMDXFiles(dir);

    return mdxFiles.map((file) => {
        const { metadata, content } = readMDXFile<T>(path.join(dir, file));
        const slug = path.basename(file, path.extname(file));
        const wordCount = content.split(/\s+/gu).length;
        const readingTimeData = readingTime(content);

        const contentWithoutCodeBlocks = content.replace(fencedCodeBlockRegex, "");

        const headings = Array.from(contentWithoutCodeBlocks.matchAll(headersRegex))
            .map((value: RegExpMatchArray) => ({
                size: value[1].length,
                content: value[2],
                slug: slugify(value[2]),
            }))
            .filter(({ size }) => size <= 3);

        return {
            metadata,
            slug,
            content,
            wordCount,
            readingTime: readingTimeData,
            headings,
        };
    });
}

export const getLatestBlogPost = async (locale: string, count: number = 1) => {
    const blogPosts = getMDXData<BlogPostMetadata>(path.join(process.cwd(), "src", "content", "blog", locale));
    return blogPosts.sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()).slice(0, count);
}

export async function getBlogPosts(locale: string) {
    return getMDXData<BlogPostMetadata>(path.join(process.cwd(), "src", "content", "blog", locale));
}

export async function getOtherPages(locale: string) {
    return getMDXData<OtherPageMetadata>(path.join(process.cwd(), "src", "content", "other", locale));
}
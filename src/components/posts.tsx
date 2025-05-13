import {getBlogPosts} from "@/lib/blogUtils";
import {getTranslations} from "next-intl/server";
import {Description, Header1, Header2} from "@/components/ui/headers";
import {Link} from "@/i18n/navigation";
import {Calendar} from "lucide-react";
import {parseISO} from "@/lib/utils";
import Image from "next/image";

const Posts = async ({locale}: {locale: string}) => {
    const posts = getBlogPosts(locale).sort((a, b) => Number(new Date(b.metadata.publishedAt)) - Number(new Date(a.metadata.publishedAt)));
    const t = await getTranslations("blog")

    return (
        <section className="overflow-hidden h-full flex flex-col items-start justify-start max-w-5xl">
            <Header1>{t("title")}</Header1>
            <Description className="mb-16">
                {t("description")}
            </Description>

            <Header2>
                {t("allPosts")}
            </Header2>
            {!posts.length && <p className="mb-4 text-red-400">
                {t("noPosts")}
            </p>}
            <div
                className="relative mt-3 ml-3 flex flex-col items-start justify-center border-l border-gray-600">
                {posts.map((post, index) => (
                    <Link href={`/blog/${post.slug}`} key={`/blog/${post.slug}`}
                          className="-mt-px mb-10 flex ml-6 rounded-lg border border-gray-600 hover:border-gray-400 pl-6 pr-3 py-3 duration-200 motion-reduce:transition-none bg-black/30 backdrop-blur-sm">
                      <div>

                        <span
                          className="absolute -left-[38px] -mt-3 flex size-6 shrink-0 items-center justify-center rounded-full border bg-gray-600 p-1 text-primary">
                       <Calendar className="size-3 text-gray-200" />
                      </span>
                        <div>
                            <h3 className="mb-1 flex items-center text-lg font-bold text-gray-200">
                                {post.metadata.title} {index === 0 && <span
                                className="mr-2 ml-3 hidden rounded-sm bg-black/10 py-0.5 pr-2.5 pl-1.5 text-sm font-medium sm:block bg-white/10">🔥 Latest</span>}
                            </h3>
                            <time
                                className="mb-2 block text-sm leading-none font-normal text-gray-600"
                                dateTime={new Date(post.metadata.publishedAt).toUTCString()}>
                                {parseISO(post.metadata.publishedAt, locale)}
                            </time>
                        </div>
                        <p className="mb-2 text-base font-normal text-gray-400">{post.metadata.summary}</p>
                        <p className="inline-flex text-sm font-bold text-primary transition duration-200 hover:underline">
                            {t("readMore")}
                        </p>
                      </div>
                        {
                            post.metadata.hero &&
                            <div className="w-92 overflow-hidden rounded-lg">
                                <Image
                                    src={post.metadata.hero}
                                    alt={post.metadata.title}
                                    width={720}
                                    height={480}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        }
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default Posts;
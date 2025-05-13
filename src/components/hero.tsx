'use client';

import {useFormatter, useMessages, useTranslations} from "next-intl";
import {useEffect, useState} from "react";
import {ArrowDown, ArrowRight, ChevronLeft, ChevronRight} from "lucide-react";
import Image from "next/image";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {Link} from "@/i18n/navigation";
import {getLatestBlogPost} from "@/lib/blogUtils";
import {useLocale} from "use-intl";

interface RotaryItem {
    type: string;
    link?: string;
    title: string;
    linkText?: string;
    summary: string;
    image: string;
    publishedAt: string;
    newPage?: boolean;
}


const Hero = () => {
    const locale = useLocale();
    const messages = useMessages();
    const rotary = messages.hero.rotary;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [items, setItems] = useState<RotaryItem[]>([{type: 'about'}, ...rotary]);

    useEffect(() => {
        const fetchLatestPosts = async () => {
            const posts = await getLatestBlogPost(locale);
            setItems((prev) => {
                const newItems = [...prev];
                newItems.splice(1, 0, ...posts.map(post => ({
                    type: 'blog',
                    ...post.metadata,
                })));
                return newItems;
            });
        };

        fetchLatestPosts().then(r => r);
    }, [locale]);

    useEffect(() => {
        if (!isPaused) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % items.length);
            }, 7000);
            return () => clearInterval(timer);
        }
    }, [items.length, isPaused]);

    return (
        <div className="relative">
            <button
                className={`text-white cursor-pointer top-3 right-4 absolute z-10 p-2 rounded-full transition-colors`}
                onClick={() => setIsPaused(!isPaused)}
            >
                {isPaused ? '▶' : '❚❚'}
            </button>
            <div className="relative">
                {items[currentIndex]?.type === 'about' ? (
                    <HeroMe/>
                ) : (
                    <RotaryItem {...items[currentIndex]}/>
                )}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2 z-10">
                    {items.map((_, idx) => (
                        <button
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                                idx === currentIndex ? 'bg-white scale-125' : 'bg-gray-500'
                            }`}
                            onClick={() => setCurrentIndex(idx)}
                        />
                    ))}
                </div>
                <button
                    className="absolute left-5 top-1/2 transform cursor-pointer -translate-y-1/2 text-white hover:bg-black/30 p-2 rounded transition-colors z-10"
                    onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)}
                >
                    <ChevronLeft className={"h-4 w-4"}/>
                </button>
                <button
                    className="absolute right-5 top-1/2 transform cursor-pointer -translate-y-1/2 text-white hover:bg-black/30 p-2 rounded transition-colors z-10"
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
                >
                    <ChevronRight className={"h-4 w-4"}/>
                </button>
            </div>
        </div>
    );
};

const HeroMe = () => {
    const t = useTranslations("hero");

    return (
        <div className="relative rounded-lg text-white overflow-hidden">
            <Image
                src={t("image")}
                alt={t("name")}
                width={1920}
                height={1080}
                className="rounded-lg shadow-lg w-full aspect-video object-cover"
            />

            <div className="absolute inset-0 flex flex-col justify-center p-6">
                <div className={"w-fit shadow bg-black/30 backdrop-blur-sm rounded-md p-3"}>
                    <h3 className="text-xl font-semibold">{t("title")}</h3>
                    <h1 className="mt-1 text-4xl font-bold">{t("welcome")}</h1>
                    <p className="mt-3 max-w-md text-lg">{t("bio")}</p>
                </div>

                <Link

                    href={t("link")}
                    className={cn("mt-4 text-gray-200 hover:text-white w-fit group", buttonVariants({variant: "default"}))}
                >
                    {t("linkText")} <ArrowDown
                    className={"group-hover:translate-y-0.5 transition-transform duration-200"}/>
                </Link>
            </div>
        </div>
    )
}


const RotaryItem = ({
                        title,
                        link,
                        linkText,
                        summary,
                        image,
                        publishedAt,
                        newPage = false,
                    }: {
    link?: string;
    title: string;
    linkText?: string;
    summary: string;
    image: string;
    publishedAt: string;
    newPage?: boolean;
}) => {
    const format = useFormatter();
    const dateObj = new Date(publishedAt);
    const formattedDate = format.dateTime(dateObj, {
        dateStyle: "long",
        timeZone: "UTC",
    })
    return (
        <div className="relative rounded-lg text-white overflow-hidden bg-black/30 backdrop-blur-sm">
            <Image
                src={image}
                alt={title}
                width={1920}
                height={1080}
                className="rounded-lg shadow-lg w-full aspect-video object-cover"
            />

            <div className="absolute inset-0 flex flex-col justify-center p-6">
                <div className={"w-fit shadow bg-black/30 backdrop-blur-sm rounded-md p-3"}>
                    <p>{publishedAt && <span className="text-sm font-semibold text-gray-400">{formattedDate}</span>}</p>
                    <h1 className="mt-1 text-4xl font-bold">{title}</h1>
                    <p className="mt-3 max-w-md text-lg">{summary}</p>
                </div>

                {
                    link &&
                    <Link
                        target={newPage ? "_blank" : undefined}
                        href={link}
                        className={cn("mt-4 text-gray-200 hover:text-white w-fit group", buttonVariants({variant: "default"}))}
                    >
                        {linkText} <ArrowRight
                        className={"group-hover:translate-x-0.5 transition-transform duration-200"}/>
                    </Link>
                }
            </div>
        </div>
    )
}

export default Hero;
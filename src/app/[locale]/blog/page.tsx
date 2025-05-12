import type {Metadata} from "next";
import Posts from "@/components/posts";
import {getTranslations} from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
    const t = await getTranslations("blog")

    return {
        title: t("title"),
        description: t("description"),
        keywords: t("keywords"),
    };
}

export default async function Page({params}: { params: Promise<{ locale: string }> }) {
    const {locale} = await params;
    return (
        <>
            <div className="h-16"/>
            <Posts locale={locale}/>
            <div className="h-16"/>
        </>
    )
}
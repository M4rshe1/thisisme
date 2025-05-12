import type {Metadata} from "next";
import "./globals.css";
import "./acrylic.css";
import "flag-icons/css/flag-icons.min.css";

import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import React from "react";
import Header from "@/components/header";
import {getTranslations} from "next-intl/server";
import { Analytics } from "@vercel/analytics/next"
import {Toaster} from "@/components/ui/sonner";
import Footer from "@/components/footer";

export const generateMetadata = async ({
                                           params
                                       }: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
    const {locale} = await params;
    const t = await getTranslations({locale, namespace: "meta"})

    return {
        title: t("title"),
        description: t("description"),
        keywords: t("keywords"),
    };
}


export default async function LocaleLayout({
                                               children,
                                               params
                                           }: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Ensure that the incoming `locale` is valid
    const {locale} = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <html lang={locale}
              className="min-h-screen m-0 p-0 font-mono dark"
        >
        <Analytics/>
        <body className="min-h-screen m-0 p-0">
        <div className="min-h-screen grid grid-cols-1 grid-rows-1">
            <div className="h-full w-full bg-black opacity-60 backdrop-blur-sm -z-5 col-start-1 row-start-1"/>
            <div className="h-full w-full acrylic-bg min-h-screen bg-opacity-10 backdrop-blur-sm -z-10 col-start-1 row-start-1"/>
            <div className="col-start-1 row-start-1 min-h-screen flex flex-col w-full h-full items-center ">
                <NextIntlClientProvider>
                    <Header/>
                    <div className={"mt-22 max-w-5xl w-full px-4 sm:px-6 lg:px-8"}>
                    {children}
                    </div>
                    <Toaster />
                    <div className="h-16"/>
                    <Footer/>
                </NextIntlClientProvider>
            </div>
        </div>
        </body>
        </html>
    );
}
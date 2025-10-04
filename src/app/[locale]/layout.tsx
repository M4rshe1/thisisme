import type { Metadata } from "next";
import "./globals.css";
import "./acrylic.css";
import "./custom.css";
import "flag-icons/css/flag-icons.min.css";

import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import React from "react";
import Header from "@/components/header";
import { getTranslations } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/footer";
import BackToTop from "@/components/back-to-top";
import { META } from "@/config/settings";
import { ReactQueryProvider } from "@/components/react-query-provider";
import MouseShadow from "@/components/mouse-shadow";
import AcrylicBackground from "@/components/acrylic-background";
import { OpenPanelComponent } from "@openpanel/nextjs";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("title", { name: META.name }),
    description: t("description"),
    keywords: t("keywords", { name: META.name }),
  };
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} className="min-h-screen m-0 p-0 font-mono dark">
      <OpenPanelComponent
        clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID as string}
        trackScreenViews={true}
        trackOutgoingLinks={true}
        trackAttributes={true}
        apiUrl="/api/op"
        // trackAttributes={true}
        // trackOutgoingLinks={true}
        // If you have a user id, you can pass it here to identify the user
        // profileId={'123'}
      />
      <body className="min-h-screen m-0 p-0">
        <div className="min-h-screen grid grid-cols-1 grid-rows-1">
          <div className="h-full w-full bg-black opacity-80 -z-5 col-start-1 row-start-1" />
          <AcrylicBackground />
          <MouseShadow />
          <div className="col-start-1 row-start-1 min-h-screen flex flex-col w-full h-full items-center ">
            <NextIntlClientProvider>
              <ReactQueryProvider>
                <Header />
                <div className={"mt-22 max-w-5xl w-full px-4 sm:px-6 lg:px-8"}>
                  {children}
                </div>
                <Toaster />
                <div className="h-16" />
                <Footer />
              </ReactQueryProvider>
            </NextIntlClientProvider>
            <BackToTop />
          </div>
        </div>
      </body>
    </html>
  );
}

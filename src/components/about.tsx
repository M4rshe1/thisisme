"use client";

import { useMessages, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Braces, Download, FileJson } from "lucide-react";
import React, { useEffect, useState } from "react";
import { highlight } from "sugar-high";
import Dot from "@/components/dot";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {META} from "@/config/settings";

const About = () => {
    const t = useTranslations();
    const messages = useMessages();
    const [age, setAge] = useState({});
    const [displayMode, setDisplayMode] = useState("full"); // 'full', 'minimized', 'closed'

    useEffect(() => {
        const calculateAge = () => {
            const birth = new Date(t("about.birthday"));
            const now = new Date();

            let years = now.getFullYear() - birth.getFullYear();
            let months = now.getMonth() - birth.getMonth();
            let days = now.getDate() - birth.getDate();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();

            if (days < 0) {
                months--;
                const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 0);
                days += lastMonth.getDate();
            }

            if (months < 0) {
                years--;
                months += 12;
            }

            return {
                [t("about.keys.years")]: years,
                [t("about.keys.months")]: months,
                [t("about.keys.days")]: days,
                [t("about.keys.hours")]: hours,
                [t("about.keys.minutes")]: minutes,
                [t("about.keys.seconds")]: seconds,
            };
        };

        const timer = setInterval(() => {
            setAge(calculateAge());
        }, 1000);

        return () => clearInterval(timer);
    }, [t]);

    // Define animation variants for the content based on display mode
    const contentVariants = {
        full: { opacity: 1, height: 500 },
        minimized: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    };

    return (
        <div className="grid auto-rows-auto grid-cols-1 gap-6 md:grid-cols-2 md:grid-rows-1">
            <div>
                <Image
                    src={"/images/me.jpg"}
                    alt={"Picture of me"}
                    width={300}
                    height={300}
                    className="rounded-lg border border-gray-600 shadow-lg"
                    style={{
                        aspectRatio: "1/1",
                    }}
                />
                <h2 className="text-3xl font-bold text-gray-200 mt-6">
                    {t("about.title")}
                    <Dot className={"ml-1.5 mt-1.5"} />
                </h2>
                <p className="whitespace-pre-line text-gray-400">
                    {t("about.description")}
                </p>
                <div className="mt-4 flex items-center gap-4 gap-2">
                    <Link
                        href={`https://githhub.com/${META.profiles.github}`}
                        className={cn(buttonVariants({ variant: "accent" }), "group")}
                    >
                        {t("buttons.viewGithub")}
                        <ArrowRight
                            className={
                                "transition-transform duration-200 group-hover:translate-x-0.5"
                            }
                        />
                    </Link>
                    <Link
                        href={"/contact"}
                        className={cn(buttonVariants({ variant: "outline" }), "group")}
                    >
                        {t("buttons.contact")}
                        <ArrowRight
                            className={
                                "transition-transform duration-200 group-hover:translate-x-0.5"
                            }
                        />
                    </Link>
                </div>
            </div>

            <div
                className={cn(
                    "flex h-fit w-full flex-col gap-2 rounded-lg border border-gray-600 bg-black/30 p-4 shadow-lg backdrop-blur-sm",
                    // We'll let framer-motion handle the height based on displayMode
                )}
            >
                <AnimatePresence mode="wait">
                    {displayMode === "closed" && (
                        <motion.div
                            key="closed"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className="flex min-h-[300px] w-full cursor-pointer flex-col items-center justify-center w-fit"
                            onClick={() => setDisplayMode("full")}
                        >
                            <FileJson size={48} className="text-yellow-400" />
                            <span className="mt-1 text-sm text-gray-400">details.json</span>
                        </motion.div>
                    )}

                    {displayMode !== "closed" && (
                        <motion.div
                            key="open"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className="relative flex w-full flex-col rounded-lg bg-accent/20 font-mono text-accent"
                        >
                            <div
                                className={cn("flex items-center justify-between p-1 text-sm text-gray-200", {
                                    "border-b border-accent/50": displayMode === "full",
                                })}
                            >
                                <div className="flex items-center gap-2 p-2 text-sm text-gray-200 ">
                                    <Braces size={16} className={"text-yellow-500 "} />
                                    <span>details.json</span>
                                </div>
                                <div className={"flex items-center gap-2 p-2 text-sm text-gray-200"}>
                                    {/* Green Button (Fullscreen) */}
                                    <button
                                        className={"h-3 w-3 rounded-full bg-green-500 cursor-pointer"}
                                        onClick={() => setDisplayMode("full")}
                                    ></button>
                                    {/* Yellow Button (Minimize) */}
                                    <button
                                        className={"h-3 w-3 rounded-full bg-yellow-500 cursor-pointer"}
                                        onClick={() => setDisplayMode("minimized")}
                                    ></button>
                                    {/* Red Button (Close) */}
                                    <button
                                        className={"h-3 w-3 rounded-full bg-red-500 cursor-pointer"}
                                        onClick={() => setDisplayMode("closed")}
                                    ></button>
                                </div>
                            </div>

                            {/* Animate the content based on displayMode */}
                            <motion.div
                                variants={contentVariants}
                                animate={displayMode === "full" ? "full" : "minimized"}
                                // No initial or exit here, as we're animating based on a state change within the same component
                            >
                                {displayMode === "full" && (
                                    <pre className="m-4 whitespace-pre-wrap text-sm">
                    <div
                        dangerouslySetInnerHTML={{
                            __html: highlight(
                                JSON.stringify(
                                    {
                                        [t("about.keys.name")]: META.name,
                                        [t("about.keys.jobTitle")]: t(
                                            "about.jobTitle",
                                        ),
                                        [t("about.keys.location")]: t("about.location"),
                                        [t("about.keys.age")]: age,
                                        [t("about.keys.languages")]:
                                        messages.about.languages,
                                        [t("about.keys.interests")]:
                                        messages.about.interests,
                                        [t("about.keys.learning")]: t("about.learning"),
                                    },
                                    null,
                                    2,
                                ),
                            ),
                        }}
                    />
                  </pre>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <Link
                    href={"/resume.pdf"}
                    className={buttonVariants({ variant: "accent" })}
                >
                    {t("about.downloadResume")}
                    <Download/>
                </Link>
            </div>
        </div>
    );
};

export default About;

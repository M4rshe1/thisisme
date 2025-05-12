"use client";

import React, {useEffect, useState} from "react";
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,} from "recharts";
import fetchWakatimeStats from "@/actions/fetchWakatimeStats";
import {useFormatter, useTranslations} from "next-intl";
import Dot from "@/components/dot";
import {Link} from "@/i18n/navigation";
import {SquareArrowOutUpRight} from "lucide-react";

interface WakaTimeStatsDef {
    total_seconds: number;
    human_readable_total: string;
    human_readable_daily_average: string;
    start: Date;
    languages: {
        name: string;
        total_seconds: number;
        text: string;
        percent: number;
    }[];
    editors: {
        name: string;
        total_seconds: number;
        text: string;
        percent: number;
    }[];
    operating_systems: {
        name: string;
        total_seconds: number;
        text: string;
        percent: number;
    }[];
}

const WakaTimeStats = () => {
    const [stats, setStats] = useState<null | WakaTimeStatsDef>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | Error>(null);
    const t = useTranslations("wakatime");
    const format = useFormatter();

    useEffect(() => {
        const getStats = async () => {
            try {
                const data = await fetchWakatimeStats();
                setStats(data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        getStats().then(r => r);
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="rounded-lg bg-black/30 p-8">
                    <p className="text-lg text-gray-300">{t("loading")}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="rounded-lg bg-black/30 p-8">
                    <p className="text-lg text-red-400">Error loading stats: {error.message}</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="rounded-lg bg-black/30 p-8">
                    <p className="text-lg text-gray-300">{t("noStats")}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-6 rounded-lg relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/0 to-gray-800 opacity-50 blur-lg"></div>
            <Link
                href={`https://wakatime.com/@${process.env.NEXT_PUBLIC_WAKATIME_USERNAME}`}
                target="_blank"
                className="absolute top-4 right-4 rounded-full bg-black/30 p-2 text-gray-200 transition hover:bg-black/50"
            >
                <SquareArrowOutUpRight className="h-5 w-5"/>
            </Link>
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-200">{t("title")}<Dot className={"ml-1"}/></h1>
                    <p className="mt-2 text-gray-400">
                        {t("totalCodingTime", {
                            startDate: format.dateTime(new Date("2023-11-11T23:00:00Z"), {
                                dateStyle: "long",
                            }),
                        })}
                    </p>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div
                        className="rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 backdrop-blur-sm">
                        <h3 className="text-sm font-medium text-gray-400">{t("totalTime")}</h3>
                        <p className="mt-2 text-2xl font-bold text-blue-400">
                            {stats.human_readable_total}
                        </p>
                    </div>

                    <div className="rounded-lg bg-gradient-to-br from-green-500/10 to-teal-500/10 p-6 backdrop-blur-sm">
                        <h3 className="text-sm font-medium text-gray-400">
                            {t("dailyAverage")}
                        </h3>
                        <p className="mt-2 text-2xl font-bold text-green-400">
                            {stats.human_readable_daily_average}
                        </p>
                    </div>

                    <div
                        className="rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 backdrop-blur-sm">
                        <h3 className="text-sm font-medium text-gray-400">
                            {t("totalLanguages")}
                        </h3>
                        <p className="mt-2 text-2xl font-bold text-purple-400">
                            {stats.languages.length}
                        </p>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Languages Chart */}
                    <div className="rounded-lg bg-black/30 p-6 backdrop-blur-sm">
                        <h2 className="mb-6 text-xl font-semibold text-gray-100">
                            {t("topLanguages")}
                        </h2>
                        {stats.languages.length > 0 ? (
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.languages.slice(0, 10)}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="rgba(255,255,255,0.1)"
                                        />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#9ca3af"
                                            fontSize={12}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tickFormatter={
                                                (value) =>
                                                    `${(Math.round(value / 3600 * 100) / 100).toFixed(0)}h`
                                            }
                                            stroke="#9ca3af"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            cursor={{fill: 'rbga(0,0,0,0.1)'}}
                                            contentStyle={{
                                                backgroundColor: "rgba(0,0,0,0.8)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderRadius: "8px",
                                            }}
                                            formatter={(_, name, props) => [
                                                props.payload.text,
                                                name,
                                            ]}
                                        />
                                        <Bar dataKey="total_seconds" fill="#8b5cf6"
                                             radius={[4, 4, 0, 0]} name={t("time")}
                                             activeBar={{fill: 'rgba(139, 92, 246, 0.7)'}}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="text-gray-400">{t("noLanguageData")}</p>
                        )}
                    </div>

                    {/* Editors Chart */}
                    <div className="rounded-lg bg-black/30 p-6 backdrop-blur-sm">
                        <h2 className="mb-6 text-xl font-semibold text-gray-100">
                            {t("topEditors")}
                        </h2>
                        {stats.editors.length > 0 ? (
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.editors.slice(0, 10)}

                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="rgba(255,255,255,0.1)"
                                        />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#9ca3af"
                                            fontSize={12}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tickFormatter={
                                                (value) =>
                                                    `${(Math.round(value / 3600 * 100) / 100).toFixed(0)}h`
                                            }
                                            stroke="#9ca3af"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            cursor={{fill: 'rbga(0,0,0,0.1)'}}
                                            contentStyle={{
                                                backgroundColor: "rgba(0,0,0,0.8)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderRadius: "8px",
                                            }}
                                            formatter={(_, name, props) => [
                                                props.payload.text,
                                                name,
                                            ]}
                                        />
                                        {/*<Legend />*/}
                                        <Bar
                                            dataKey="total_seconds"
                                            fill="#10b981"
                                            radius={[4, 4, 0, 0]}
                                            name={t("time")}
                                            activeBar={{fill: 'rgba(16, 185, 129, 0.7)'}}

                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="text-gray-400">{t("noEditorData")}</p>
                        )}
                    </div>

                    {/* Operating Systems Chart */}
                    <div className="rounded-lg bg-black/30 p-6 backdrop-blur-sm lg:col-span-2">
                        <h2 className="mb-6 text-xl font-semibold text-gray-100">
                            {t("topOperatingSystems")}
                        </h2>
                        {stats.operating_systems.length > 0 ? (
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.operating_systems.slice(0, 10)}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="rgba(255,255,255,0.1)"
                                        />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#9ca3af"
                                            fontSize={12}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tickFormatter={
                                                (value) =>
                                                    `${(Math.round(value / 3600 * 100) / 100).toFixed(0)}h`
                                            }
                                            stroke="#9ca3af"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            cursor={{fill: 'rbga(0,0,0,0.1)'}}
                                            contentStyle={{
                                                backgroundColor: "rgba(0,0,0,0.8)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderRadius: "8px",
                                            }}
                                            formatter={(_, name, props) => [
                                                props.payload.text,
                                                name,
                                            ]}
                                        />
                                        {/*<Legend />*/}
                                        <Bar
                                            dataKey="total_seconds"
                                            fill="#f59e0b"
                                            radius={[4, 4, 0, 0]}
                                            name={t("os")}
                                            activeBar={{fill: 'rgba(249, 158, 9, 0.7)'}}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="text-gray-400">{t("noOperatingSystemData")}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WakaTimeStats;

import { getMessages, getTranslations } from "next-intl/server";
import { Description, Header1 } from "@/components/ui/headers";
import { parseISO } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import TechnologyBadge from "@/components/technology-badge";

interface CareerData {
    career: {
        title: string;
        description: string;
        experienceTitle: string;
        educationTitle: string;
        experience: {
            company: string;
            department: string;
            role: string;
            startDate: string;
            endDate: string | null;
            tech: string[];
            description: string;
        }[];
        education: {
            school: string;
            degree: string;
            startDate: string;
            endDate: string | null;
            description: string;
        }[];
    };
}

interface TimelineItem {
    type: "experience" | "education";
    startDate: Date;
    endDate: Date;
    column?: number;
    isOverlapping?: boolean;
    [key: string]: unknown;
}

const CareerTimeline = async ({ locale }: { locale: string }) => {
    const t = await getTranslations("career");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const messages: CareerData = await getMessages();

    const allItems = [
        ...messages.career.experience.map((item) => ({
            ...item,
            type: "experience" as const,
            startDate: new Date(item.startDate),
            endDate: item.endDate ? new Date(item.endDate) : new Date(),
        })),
        ...messages.career.education.map((item) => ({
            ...item,
            type: "education" as const,
            startDate: new Date(item.startDate),
            endDate: item.endDate ? new Date(item.endDate) : new Date(),
        })),
    ];

    const assignColumns = (items: TimelineItem[]): TimelineItem[] => {
        const sortedItems = [...items].sort(
            (a, b) => a.startDate.getTime() - b.startDate.getTime()
        );

        const itemsWithColumns = sortedItems.map((item) => ({
            ...item,
            column: 0,
            isOverlapping: false,
        }));

        for (let i = 0; i < itemsWithColumns.length; i++) {
            const current = itemsWithColumns[i];
            const overlapping = itemsWithColumns
                .slice(0, i)
                .filter(
                    (item) =>
                        item.type === current.type &&
                        item.endDate.getTime() > current.startDate.getTime()
                );

            if (overlapping.length > 0) {
                current.isOverlapping = true;
                overlapping.forEach((item) => {
                    item.isOverlapping = true;
                });

                const usedColumns = new Set(overlapping.map((item) => item.column));
                let column = 0;
                while (usedColumns.has(column)) {
                    column++;
                }
                current.column = column;
            }
        }

        return itemsWithColumns;
    };

    const itemsWithColumns = assignColumns(allItems);

    const earliestStartDate = new Date(
        Math.min(...allItems.map((item) => item.startDate.getTime()))
    );
    const latestEndDate = new Date(
        Math.max(...allItems.map((item) => item.endDate.getTime()))
    );

    const startYear = earliestStartDate.getFullYear();
    const endYear = latestEndDate.getFullYear() + 1;
    const years = Array.from(
        { length: endYear - startYear + 1 },
        (_, i) => startYear + i
    );

    const PIXELS_PER_YEAR = 150;
    const timelineHeight = PIXELS_PER_YEAR * (years.length - 1);

    const getItemPosition = (date: Date) => {
        const yearDiff = date.getFullYear() - startYear;
        const monthOffset = date.getMonth() / 12;
        return (yearDiff + monthOffset) * PIXELS_PER_YEAR;
    };

    const getColumnWidth = (items: TimelineItem[], type: string) => {
        const maxColumn = Math.max(
            ...items
                .filter((item) => item.type === type && item.isOverlapping)
                .map((item) => item.column ?? 1)
        );
        return maxColumn + 1;
    };

    const experienceColumns = getColumnWidth(itemsWithColumns, "experience");
    const educationColumns = getColumnWidth(itemsWithColumns, "education");

    return (
        <section className="overflow-hidden h-full flex flex-col items-start justify-start max-w-7xl">
            <Header1>{t("title")}</Header1>
            <Description className="mb-16">{t("description")}</Description>

            <div className="relative w-full grid grid-cols-[60px_1fr_1fr] gap-4">
                {/* Year Labels Column */}
                <div className="relative" style={{ height: `${timelineHeight}px` }}>
                    {years.map((year) => (
                        <div
                            key={year}
                            className="absolute left-0 transform -translate-y-1/2 text-sm text-gray-400"
                            style={{
                                top: `${(year - startYear) * PIXELS_PER_YEAR}px`,
                            }}
                        >
                            {year}
                        </div>
                    ))}
                </div>

                {/* Experience Column */}
                <div
                    className="relative border-l border-gray-700"
                    style={{ height: `${timelineHeight}px` }}
                >
                    <h2 className="text-lg font-semibold text-gray-200 mb-4 pl-6">
                        {t("experienceTitle")}
                    </h2>
                    <TooltipProvider>
                        {itemsWithColumns
                            .filter((item) => item.type === "experience")
                            .map((item, index) => {
                                const topPosition = getItemPosition(item.startDate);
                                const bottomPosition = getItemPosition(item.endDate);
                                const height = bottomPosition - topPosition;
                                const now = new Date();
                                const isPresent =
                                    item.endDate.getDate() === now.getDate() &&
                                    item.endDate.getMonth() === now.getMonth() &&
                                    item.endDate.getFullYear() === now.getFullYear();

                                const columnWidth = item.isOverlapping
                                    ? 100 / experienceColumns
                                    : 100;

                                return (
                                    <Tooltip key={`experience-${index}`}>
                                        <TooltipTrigger>
                                            <div
                                                className="absolute left-0 group"
                                                style={{
                                                    top: `${topPosition}px`,
                                                    height: `${height}px`,
                                                    width: `${columnWidth}%`,
                                                    left: item.isOverlapping
                                                        ? `${(item?.column || 0) * columnWidth}%`
                                                        : "0",
                                                }}
                                            >
                                                <div className="w-[calc(100%-8px)] mx-1 bg-gray-800/50 flex flex-col justify-center items-center h-full border-l-4 border-blue-500 px-4 transition-colors group-hover:bg-gray-800/80">
                                                    <p className="text-sm font-medium text-gray-200">
                                                        {item.role}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {item.department} - {item.company}
                                                    </p>
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="right"
                                            className="max-w-md bg-black/30 backdrop-blur-lg text-gray-200 border-gray-600 border"
                                        >
                                            <div className="p-2">
                                                <h3 className="font-bold text-lg mb-2">
                                                    {`${item.role} at ${item.company}`}
                                                </h3>
                                                <p className="text-sm text-gray-400 mb-2">
                                                    {parseISO(item.startDate.toISOString(), locale)} -{" "}
                                                    {isPresent
                                                        ? t("present")
                                                        : parseISO(item.endDate.toISOString(), locale)}
                                                </p>
                                                <p className="text-sm mb-2">{item.description}</p>
                                                {item.tech && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {item.tech.map((tech: string, index: number) => (
                                                            <TechnologyBadge tech={tech} key={index}/>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                    </TooltipProvider>
                </div>

                {/* Education Column */}
                <div
                    className="relative border-l border-gray-700"
                    style={{height: `${timelineHeight}px`}}
                >
                    <h2 className="text-lg font-semibold text-gray-200 mb-4 pl-6">
                        {t("educationTitle")}
                    </h2>
                    <TooltipProvider>
                        {itemsWithColumns
                            .filter((item) => item.type === "education")
                            .map((item, index) => {
                                const topPosition = getItemPosition(item.startDate);
                                const bottomPosition = getItemPosition(item.endDate);
                                const height = bottomPosition - topPosition;
                                const now = new Date();
                                const isPresent =
                                    item.endDate.getDate() === now.getDate() &&
                                    item.endDate.getMonth() === now.getMonth() &&
                                    item.endDate.getFullYear() === now.getFullYear();

                                const columnWidth = item.isOverlapping
                                    ? 100 / educationColumns
                                    : 100;

                                return (
                                    <Tooltip key={`education-${index}`}>
                                        <TooltipTrigger>
                                            <div
                                                className="absolute left-0 group"
                                                style={{
                                                    top: `${topPosition}px`,
                                                    height: `${height}px`,
                                                    width: `${columnWidth}%`,
                                                    left: item.isOverlapping
                                                        ? `${(item?.column || 0) * columnWidth}%`
                                                        : "0",
                                                }}
                                            >
                                                <div className="w-[calc(100%-8px)] mx-1 bg-gray-800/50 flex flex-col justify-center items-center h-full border-l-4 border-green-500 px-4 transition-colors group-hover:bg-gray-800/80">
                                                    <p className="text-sm font-medium text-gray-200">
                                                        {item.degree}
                                                    </p>
                                                    <p className="text-xs text-gray-400">{item.school}</p>
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="right"
                                            className="max-w-md bg-black/30 backdrop-blur-lg text-gray-200 border-gray-600 border"
                                        >
                                            <div className="p-2">
                                                <h3 className="font-bold text-lg mb-2">
                                                    {`${item.degree} at ${item.school}`}
                                                </h3>
                                                <p className="text-sm text-gray-400 mb-2">
                                                    {parseISO(item.startDate.toISOString(), locale)} -{" "}
                                                    {isPresent
                                                        ? t("present")
                                                        : parseISO(item.endDate.toISOString(), locale)}
                                                </p>
                                                <p className="text-sm">{item.description}</p>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                    </TooltipProvider>
                </div>
            </div>
        </section>
    );
};

export default CareerTimeline;

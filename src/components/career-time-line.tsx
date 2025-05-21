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
import { cn } from "@/lib/utils";
import {SETTINGS} from "@/config/settings";

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
    company?: string;
    department?: string;
    role?: string;
    school?: string;
    degree?: string;
    tech?: string[];
    description?: string;
}

// Constants for timeline layout
const PIXELS_PER_YEAR = 150;

// Helper function to assign columns
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

// Helper function to get column width based on overlaps
const getColumnWidth = (items: TimelineItem[], type: string) => {
    const maxColumn = Math.max(
        ...items
            .filter((item) => item.type === type && item.isOverlapping)
            .map((item) => item.column ?? 1)
    );
    return maxColumn + 1;
};

// Helper function to get the vertical position of an item
const getItemPosition = (date: Date, startYear: number) => {
    const yearDiff = date.getFullYear() - startYear;
    const monthOffset = date.getMonth() / 12;
    return (yearDiff + monthOffset) * PIXELS_PER_YEAR;
};

// --- New Modular Components ---

// Component for the year labels column
const TimelineYearLabels = ({
                                years,
                                startYear,
                            }: {
    years: number[];
    startYear: number;
}) => {
    return (
        <div className="relative">
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
    );
};

// Component for a single timeline item (Experience or Education)
const TimelineItemComponent = ({
                                   item,
                                   locale,
                                   t,
                                   startYear,
                                   columnCount,
                                   borderColor,
                                   isFuture, // New prop to indicate if the item is in the future
                               }: {
    item: TimelineItem;
    locale: string;
    t: (key: string) => string;
    startYear: number;
    columnCount: number;
    borderColor: string;
    isFuture: boolean;
}) => {
    const topPosition = getItemPosition(item.startDate, startYear);
    const bottomPosition = getItemPosition(item.endDate, startYear);
    const height = bottomPosition - topPosition;
    const now = new Date();
    const isPresent =
        item.endDate.getDate() === now.getDate() &&
        item.endDate.getMonth() === now.getMonth() &&
        item.endDate.getFullYear() === now.getFullYear();

    const columnWidth = item.isOverlapping ? 100 / columnCount : 100;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div
                    className={cn(
                        "absolute left-0 group transition-opacity",
                        isFuture && "opacity-40" // Apply greyed out style if in the future
                    )}
                    style={{
                        top: `${topPosition}px`,
                        height: `${height}px`,
                        width: `${columnWidth}%`,
                        left: item.isOverlapping
                            ? `${(item?.column || 0) * columnWidth}%`
                            : "0",
                    }}
                >
                    <div
                        className={`w-[calc(100%-8px)] mx-1 bg-gray-800/50 flex flex-col justify-center items-center h-full border-l-4 ${borderColor} px-4 transition-colors group-hover:bg-gray-800/80`}
                    >
                        {item.type === "experience" ? (
                            <>
                                <p className="text-sm font-medium text-gray-200">
                                    {item.role}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {item.department} - {item.company}
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-medium text-gray-200">
                                    {item.degree}
                                </p>
                                <p className="text-xs text-gray-400">{item.school}</p>
                            </>
                        )}
                    </div>
                </div>
            </TooltipTrigger>
            <TooltipContent
                side="right"
                className="max-w-md bg-black/30 backdrop-blur-lg text-gray-200 border-gray-600 border"
                sideOffset={5}
            >
                <div className="p-2">
                    {item.type === "experience" ? (
                        <h3 className="font-bold text-lg mb-2">
                            {`${item.role} at ${item.company}`}
                        </h3>
                    ) : (
                        <h3 className="font-bold text-lg mb-2">
                            {`${item.degree} at ${item.school}`}
                        </h3>
                    )}
                    <p className="text-sm text-gray-400 mb-2">
                        {parseISO(item.startDate.toISOString(), locale)} -{" "}
                        {isPresent
                            ? t("present")
                            : parseISO(item.endDate.toISOString(), locale)}
                    </p>
                    <p className="text-sm mb-2">{item.description}</p>
                    {item.type === "experience" && item.tech && (
                        <div className="flex flex-wrap gap-1">
                            {item.tech.map((tech: string, index: number) => (
                                <TechnologyBadge tech={tech} key={index} />
                            ))}
                        </div>
                    )}
                </div>
            </TooltipContent>
        </Tooltip>
    );
};

// Component for a timeline column (Experience or Education)
const TimelineColumn = ({
                            items,
                            title,
                            locale,
                            t,
                            startYear,
                            columnCount,
                            borderColor,
                            latestEndDate
                        }: {
    items: TimelineItem[];
    title: string;
    locale: string;
    t: (key: string) => string;
    startYear: number;
    columnCount: number;
    borderColor: string;
    latestEndDate: Date;
}) => {
    const endYear = latestEndDate.getFullYear() + 1;
    const totalYears = endYear - startYear;
    const timelineHeight = PIXELS_PER_YEAR * totalYears;

    return (
        <div
            className="relative border-l border-gray-700"
            style={{ height: `${timelineHeight}px` }}
        >
            <h2 className="text-lg font-semibold text-gray-200 mb-4 pl-6">{title}</h2>
            <TooltipProvider delayDuration={0}>
                {items.map((item, index) => {
                    const isFuture = item.startDate.getTime() > new Date().getTime();
                    return (
                        <TimelineItemComponent
                            key={`${item.type}-${index}`}
                            item={item}
                            locale={locale}
                            t={t}
                            startYear={startYear}
                            columnCount={columnCount}
                            borderColor={borderColor}
                            isFuture={isFuture} // Pass down the isFuture prop
                        />
                    );
                })}
            </TooltipProvider>
        </div>
    );
};

// --- Main CareerTimeline Component ---
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

    const experienceColumns = getColumnWidth(itemsWithColumns, "experience");
    const educationColumns = getColumnWidth(itemsWithColumns, "education");

    // Calculate the vertical position of the current date
    const now = new Date();
    const nowPosition = getItemPosition(now, startYear);

    return (
        <section className="overflow-hidden h-full flex flex-col items-start justify-start max-w-7xl">
            <Header1>{t("title")}</Header1>
            <Description className="mb-16">{t("description")}</Description>

            <div className="relative w-full grid grid-cols-[60px_1fr_1fr] gap-4">
                {/* Year Labels Column */}
                <TimelineYearLabels years={years} startYear={startYear} />

                {/* "Now" Label */}
                {
                    SETTINGS.career.showNowLineText &&
                <div
                    className="absolute z-10 transform mt-1 -translate-y-1/2 text-sm text-red-500 font-bold"
                    style={{ top: `${nowPosition}px` }}
                >
                    {t("now")}
                </div>
                }
                {
                 SETTINGS.career.showFutureOverlay &&
                <div
                    className={cn("absolute z-10 mt-1 w-[calc(100%-85px)] right-1 diagonal-striped-background", {
                        " border-red-500 border-t border-dashed": SETTINGS.career.showNowLine,
                    })}
                    style={{ top: `${nowPosition}px`, height: `calc(100% - ${nowPosition + 10}px)` }}
                ></div>
                }


                {/* Experience Column */}
                <TimelineColumn
                    items={itemsWithColumns.filter((item) => item.type === "experience")}
                    title={t("experienceTitle")}
                    locale={locale}
                    t={t}
                    startYear={startYear}
                    columnCount={experienceColumns}
                    borderColor="border-blue-500"
                    latestEndDate={latestEndDate}
                />

                {/* Education Column */}
                <TimelineColumn
                    items={itemsWithColumns.filter((item) => item.type === "education")}
                    title={t("educationTitle")}
                    locale={locale}
                    t={t}
                    startYear={startYear}
                    columnCount={educationColumns}
                    borderColor="border-green-500"
                    latestEndDate={latestEndDate}
                />
            </div>
        </section>
    );
};

export default CareerTimeline;

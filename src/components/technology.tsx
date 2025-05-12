import { useTranslations} from "next-intl";
import Dot from "@/components/dot";
import React from "react";
import TechnologyBadge from "@/components/technology-badge";
import {TECH} from "@/lib/settings";

const Technology = () => {
    const t = useTranslations("technologies");

    return (
        <div className="flex flex-col justify-center w-full">
            <h1 className="text-3xl font-bold">
                {t("title")}
                <Dot className={"mt-1.5 ml-1.5"}/>
            </h1>
            <p className="mt-4 text-lg text-gray-400">
                {t("description")}</p>
            <div className="flex items-start justify-start w-full flex-wrap gap-2 mt-4 w-fit">
                {
                    TECH.map((technology: string, index: number) => {
                        return (
                            <TechnologyBadge tech={technology} key={index}/>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default Technology;
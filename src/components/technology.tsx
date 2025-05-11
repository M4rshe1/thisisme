import {useMessages} from "next-intl";
import Dot from "@/components/dot";
import React from "react";
import TechnologyBadge from "@/components/technology-badge";

const Technology = () => {
    const messages = useMessages();

    return (
        <div className="flex flex-col justify-center w-full my-16">
            <h1 className="text-3xl font-bold">
                {messages.technologies.title}
                <Dot className={"mt-1.5 ml-1.5"}/>
            </h1>
            <p className="mt-4 text-lg text-gray-400">
                {messages.technologies.description}</p>
            <div className="flex items-center justify-start w-full flex-wrap gap-2 mt-4">
                {
                    messages.technologies.tech.map((technology: string, index: number) => {
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
"use client"

import technologies, {TechnologyDef} from "@/lib/technologies";
import Image from "next/image";

export const TechnologyBadge = ({tech}: { tech: string }) => {
    const content: TechnologyDef | null | undefined = technologies[tech];
    if (!content) {
        return null;
    }

    return (
        <div
            className="flex items-center border rounded border-gray-800 p-1 mb-2 max-w-2xl shadow transition-all duration-300 ease-in-out cursor-default"
            style={{
                borderColor: `${content.color}33`,
                backgroundColor: `${content.color}15`,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                '--hover-border-color': `${content.color}ff`,
                '--hover-bg-color': `${content.color}33`,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = e.currentTarget.style.getPropertyValue('--hover-border-color');
                e.currentTarget.style.backgroundColor = e.currentTarget.style.getPropertyValue('--hover-bg-color');
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${content.color}33`;
                e.currentTarget.style.backgroundColor = `${content.color}15`;
            }}
        >
            <Image
                src={content.icon}
                alt={content.name}
                className="w-5 h-5 mr-2"
                width={24}
                height={24}
            />
            <span className="text-sm">{content.name}</span>
        </div>
    );
}

export default TechnologyBadge;
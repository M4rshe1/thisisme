"use client"

import Image from "next/image";
import {META, Social} from "@/config/settings";
import {Link} from "@/i18n/navigation";
import {ArrowRight} from "lucide-react";
import React from "react";


const SocialBadge = ({social}: { social: Social }) => {

    return (
        <Link
            href={social.template.replace("{{username}}", META.profiles[social.key] ?? "")}
            target="_blank"
            className="flex items-center cursor-pointer border rounded border-gray-800 p-2 mb-2 max-w-2xl mx-auto shadow transition-all duration-300 ease-in-out cursor-default group"
            style={{
                borderColor: `${social.color}33`,
                backgroundColor: `${social.color}15`,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                '--hover-border-color': `${social.color}ff`,
                '--hover-bg-color': `${social.color}33`,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = e.currentTarget.style.getPropertyValue('--hover-border-color');
                e.currentTarget.style.backgroundColor = e.currentTarget.style.getPropertyValue('--hover-bg-color');
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${social.color}33`;
                e.currentTarget.style.backgroundColor = `${social.color}15`;
            }}
        >
            {
                "image" in social ?
                    <Image
                        src={social.image}
                        alt={social.name}
                        className="w-5 h-5 mr-2"
                        width={24}
                        height={24}
                    /> :
                    <social.icon
                        style={{
                            color: social.color,
                        }}
                        className="w-5 h-5 mr-2"
                        width={24}
                        height={24}
                    />
            }
            <span>{social.name}</span><ArrowRight className={"w-4 h-4 ml-2 mr-1 group-hover:translate-x-0.5 transition-transform duration-200"}/>
        </Link>
    );
}

export default SocialBadge;
import {useFormatter, useTranslations} from "next-intl";
import Image from "next/image";
import TechnologyBadge from "@/components/technology-badge";
import {Link} from "@/i18n/navigation";
import {buttonVariants} from "@/components/ui/button";
import {ArrowRight, LinkIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {IconBrandGithub} from "@tabler/icons-react";

export interface ProjectProps {
    name: string;
    description: string;
    image: string;
    link?: string;
    github: string;
    technologies: string[];
    startDate: string;
    endDate?: string;
}

const Project = ({name, description, image, github, link, technologies, startDate, endDate}: ProjectProps) => {
    const t = useTranslations("recentProjects");

    const format = useFormatter();
    const formattedStartDate = format.dateTime(new Date(startDate), {
        dateStyle: "long",
        timeZone: "UTC",
    })

    const formattedEndDate = endDate ? format.dateTime(new Date(endDate), {
        dateStyle: "long",
        timeZone: "UTC",
    }) : t("noEndDate")

    return (
        <div className={"flex flex-col md:flex-row items-center justify-between mb-4 w-full"}>
            <div className={"flex flex-col gap-2 w-full"}>
                <h3 className={"text-lg font-semibold text-gray-200"}>{name}</h3>
                <p className={"text-sm text-gray-600"}>{formattedStartDate} - {formattedEndDate}</p>
                <p className={"text-sm text-gray-400"}>{description}</p>
                <Image
                    src={image}
                    alt={name}
                    width={300}
                    height={200}
                    className={"rounded-md shadow-md w-full aspect-video object-cover border border-gray-600"}
                />
                <div className={"flex gap-2 mt-2 flex-wrap justify-start w-fit"}>
                    {technologies.map((tech, index) => (
                        <TechnologyBadge
                            tech={tech}
                            key={index}
                        />
                    ))}
                </div>
                <div className={"flex flex-col md:flex-row gap-2 mt-4 md:mt-0"}>
                    {github && (
                        <Link href={github} target="_blank" rel="noopener noreferrer"
                              className={cn(buttonVariants({variant: "accent"}), "group")}>
                            <IconBrandGithub/>
                            {t("viewGithub")}
                            <ArrowRight className={"group-hover:translate-x-0.5 transition-transform duration-200"}/>
                        </Link>
                    )}
                    {link && (
                        <Link href={link} target="_blank" rel="noopener noreferrer"
                              className={cn(buttonVariants({variant: "default"}), "group")}>
                            <LinkIcon/>
                            {t("visitWebsite")}
                            <ArrowRight className={"group-hover:translate-x-0.5 transition-transform duration-200"}/>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Project;
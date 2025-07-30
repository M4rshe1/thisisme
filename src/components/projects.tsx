import { useMessages, useTranslations } from "next-intl";
import Project, { ProjectProps } from "@/components/project";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Dot from "@/components/dot";
import React from "react";
import { META } from "@/config/settings";

const Projects = ({ count }: { count?: number }) => {
  const t = useTranslations("projects");
  const messages = useMessages();
  const projectsCount = count ?? messages.projects.projects.length;
  const projects = messages.projects.projects.slice(0, projectsCount);
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold">
        {t("title")}
        <Dot className={"ml-1"} />
      </h2>
      <p className="text-gray-400">{t("description")}</p>
      <div className="flex flex-col gap-2 mt-4">
        {projects.map((project: ProjectProps, index: number) => (
          <Project key={index} {...project} />
        ))}
      </div>
      <div className="flex justify-center flex-col gap-2 items-center mt-4">
        <p className={"text-gray-400"}>{t("seeMore")}</p>
        <div className="flex gap-2 justify-center items-center gap-4">
          <Link
            href={"/projects"}
            className={cn(buttonVariants({ variant: "outline" }), "group")}
          >
            {t("viewAll")}{" "}
            <ArrowRight
              className={
                "group-hover:translate-x-0.5 transition-transform duration-200"
              }
            />
          </Link>
          <Link
            href={`https://github.com/${META.profiles.github}`}
            className={cn(buttonVariants({ variant: "accent" }), "group")}
          >
            {t("viewGithub")}{" "}
            <ArrowRight
              className={
                "group-hover:translate-x-0.5 transition-transform duration-200"
              }
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Projects;

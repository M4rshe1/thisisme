"use client";

import Logo from "@/components/logo";
import Settings from "@/components/settings";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, LucideIcon, Menu, X } from "lucide-react";
import { useState } from "react";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandYoutube,
  TablerIcon,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { META } from "@/config/settings";

const Header = () => {
  const t = useTranslations();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const moreLinks = [
    {
      label: t("header.github.title"),
      href: `https://github.com/${META.socials.github}`,
      icon: IconBrandGithub,
      description: t("header.github.description"),
    },
    {
      label: t("header.linkedin.title"),
      href: `https://www.linkedin.com/in/${META.socials.linkedin}`,
      icon: IconBrandLinkedin,
      description: t("header.linkedin.description"),
    },
    {
      label: t("header.youtube.title"),
      href: `https://www.youtube.com/@${META.socials.youtube}`,
      description: t("header.youtube.description"),
      icon: IconBrandYoutube,
    },
  ];

  return (
    <header className="fixed top-0 right-0 left-0 px-4 xl:px-0 mt-4 z-50">
      <div
        className={
          "flex items-center justify-between p-2 rounded-lg border border-gray-600 text-white shadow-lg bg-black/30 backdrop-blur-sm z-50 lg:max-w-7xl w-full mx-auto"
        }
      >
        <Link href={"/"} className="flex items-center gap-2">
          <Logo />
          <span className="text-lg font-bold hidden sm:block">
            {t("meta.author", { name: META.name })}
          </span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-8 lg:gap-12">
          <div className="hidden sm:flex items-center gap-4 lg:gap-8">
            <HeaderLink path={"/projects"} text={t("header.projects")} />
            <HeaderLink path={"/blog"} text={t("header.blog")} />
            <HeaderLink path={"/contact"} text={t("header.contact")} />
            <HeaderLink path={"/career "} text={t("header.career ")} />
            <HeaderMoreLink links={moreLinks} />
          </div>
          <Settings />
          <button
            className="sm:hidden cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-400" />
            ) : (
              <Menu className="h-6 w-6 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden fixed inset-x-0 top-20 p-4 bg-black/95 backdrop-blur-sm border-b border-gray-600">
          <div className="flex flex-col gap-4">
            <HeaderLink path={"/projects"} text={t("header.projects")} />
            <HeaderLink path={"/blog"} text={t("header.blog")} />
            <HeaderLink path={"/contact"} text={t("header.contact")} />
            <div className="border-t border-gray-600 pt-4">
              <p className="text-sm text-gray-400 mb-2">{t("buttons.more")}</p>
              {moreLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  target="_blank"
                  className="flex items-center gap-2 p-2 rounded transition duration-300 ease-in-out hover:bg-gray-800/50 hover:text-gray-200 text-gray-400"
                >
                  <div
                    className={
                      "flex items-center justify-center h-10 w-10 rounded bg-gray-800/50 aspect-square"
                    }
                  >
                    <link.icon className="h-6 w-6 text-gray-200" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-200">{link.label}</p>
                    <p className="text-xs text-gray-400">{link.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const HeaderLink = ({ path, text }: { path: string; text: string }) => {
  return (
    <Link
      href={path}
      className="text-sm hover:underline transition duration-300 ease-in-out text-gray-400 hover:text-gray-200 transition-colors duration-300"
    >
      {text}
    </Link>
  );
};

interface HeaderMoreLinkProps {
  links: {
    label: string;
    href: string;
    description: string;
    icon: LucideIcon | TablerIcon;
  }[];
}

const HeaderMoreLink = ({ links }: HeaderMoreLinkProps) => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <span
          onClick={() => setOpen(!open)}
          className="text-sm hover:underline transition duration-300 ease-in-out text-gray-400 hover:text-gray-200 transition-colors duration-300 flex items-center gap-2 cursor-pointer"
        >
          {t("buttons.more")}{" "}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              open ? "rotate-180" : "rotate-0"
            )}
          />
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-92 mr-20">
        <div className="flex flex-col gap-2">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              target="_blank"
              className="flex items-center gap-2 p-2 rounded transition duration-300 ease-in-out hover:bg-gray-800/50 hover:text-gray-200 text-gray-400"
            >
              <div
                className={
                  "flex items-center justify-center h-12 w-12 rounded bg-gray-800/50 aspect-square"
                }
              >
                <link.icon className="h-8 w-8 text-gray-200" />
              </div>
              <div>
                <p className="text-sm text-gray-200">{link.label}</p>
                <p className="text-sm text-gray-400">{link.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Header;

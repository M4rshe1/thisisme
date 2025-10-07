import React from "react";
import { META, SOCIALS } from "@/config/settings";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("footer");
  const links = [
    {
      category: t("category.importantLinks"),
      children: [
        {
          name: t("links.home"),
          link: "/",
        },
        {
          name: t("links.projects"),
          link: "/projects",
        },
        {
          name: t("links.blog"),
          link: "/blog",
        },
        {
          name: t("links.career"),
          link: "/career",
        },
        {
          name: t("links.recipes"),
          link: "/recipes",
        },
      ],
    },
    {
      category: t("category.socials"),
      children: SOCIALS.map((social) => {
        return {
          name: social.name,
          link: social.template.replace(
            "{{username}}",
            META.socials[social.key as keyof typeof META.socials] ?? ""
          ),
        };
      }),
    },
    {
      category: t("category.other"),
      children: [
        {
          name: t("links.contact"),
          link: "/contact",
        },
        {
          name: t("links.uses"),
          link: "/uses",
        },
      ],
    },
  ];

  return (
    <footer className="lg:max-w-3xl w-full mx-auto py-4 border-t border-gray-600">
      <div className="w-full text-gray-600 text-sm mb-4">
        <p className="mb-4">
          Copyright © {new Date().getFullYear()} {META.name} aka.{" "}
          {META.socials.github}
        </p>
        {/*<p className="italic">&#34;Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday&#39;s code.&#34; -Dan Salomon</p>*/}
      </div>
      <div className="container flex justify-between items-start mx-auto mt-4">
        {links.map((linkGroup) => (
          <div key={linkGroup.category} className="flex flex-col">
            <h3 className="text-lg font-semibold mb-2">{linkGroup.category}</h3>
            <ul className="space-y-2">
              {linkGroup.children.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.link}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;

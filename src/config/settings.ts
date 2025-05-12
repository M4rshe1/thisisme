import {IconBrandDiscord, IconBrandGithub, IconBrandLinkedin, IconBrandYoutube, TablerIcon} from "@tabler/icons-react";
import {AtSignIcon, LucideIcon} from "lucide-react";
import {technologyNames} from "@/lib/technologies";

export const TECH: technologyNames[] = [
    "javascript",
    "typescript",
    "nodejs",
    "npm",
    "react",
    "nextjs",
    "postgresql",
    "git",
    "github",
    "docker",
    "office",
    "excel",
    "tailwindcss",
    "vercel",
    "eslint",
    "webpack",
    "express",
    "word",
    "powerpoint",
    "wordpress",
    "ubuntu",
    "linux",
    "windows",
    "raspberrypi",
    "debian",
    "python",
    "shadcnui",
    "powerbi",
    "prisma",
    "google",
    "cloudflare",
    "pycharm",
    "vscode",
    "webstorm",
    "jetbrains",
    "visualstudio",
    "powershell",
]

export type Social = SocialWithIcon | SocialWithImage

interface BaseSocial {
    link: string
    name: string
    color: string
}

interface SocialWithIcon extends BaseSocial {
    icon: LucideIcon | TablerIcon
}

interface SocialWithImage extends BaseSocial {
    image: string
}

export const SOCIALS: Social[] = [
    {
        name: "Email",
        icon: AtSignIcon,
        link: "mailto:colin@heggli.dev",
        color: "#fefefe"
    },
    {
        name: "Github",
        icon: IconBrandGithub,
        link: "https://github.com/m4rshe1",
        color: "#ffffff"
    },
    {
        name: "LinkedIn",
        icon: IconBrandLinkedin,
        link: "https://www.linkedin.com/in/colin-heggli/",
        color: "#0A66C2"
    },
    {
        name: "Instagram",
        image: "/images/tech/instagram.svg",
        link: "https://www.instagram.com/m4rshe1_/",
        color: "#E4405F"
    },
    {
        name: "Youtube",
        icon: IconBrandYoutube,
        link: "https://www.youtube.com/channel/UCU0bh2sZt9NQmUbn6jLJl3g",
        color: "#FF0000"
    },
    {
        name: "Discord",
        icon: IconBrandDiscord,
        link: "https://discord.com/users/633749833747922959",
        color: "#5865F2"
    }
]

export const URL = "https://colin.heggli.dev"
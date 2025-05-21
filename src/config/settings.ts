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
    "i18n",
]

export type Social = SocialWithIcon | SocialWithImage

interface BaseSocial {
    name: string
    color: string
    key: string
    template: string
}

interface SocialWithIcon extends BaseSocial {
    icon: LucideIcon | TablerIcon
}

interface SocialWithImage extends BaseSocial {
    image: string
}


export interface Meta {
    name: string
    title: string
    url: string
    profiles: {
        [key: string]: string
    }
}

export const SOCIALS: Social[] = [
    {
        name: "Email",
        icon: AtSignIcon,
        color: "#fefefe",
        key: "email",
        template: "mailto:{{username}}",
    },
    {
        name: "Github",
        icon: IconBrandGithub,
        color: "#ffffff",
        key: "github",
        template: "https://github.com/{{username}}",
    },
    {
        name: "LinkedIn",
        icon: IconBrandLinkedin,
        color: "#0A66C2",
        key: "linkedin",
        template: "https://www.linkedin.com/in/{{username}}",
    },
    {
        name: "Instagram",
        image: "/images/tech/instagram.svg",
        color: "#E4405F",
        key: "instagram",
        template: "https://www.instagram.com/{{username}}",
    },
    {
        name: "Youtube",
        icon: IconBrandYoutube,
        color: "#FF0000",
        key: "youtube",
        template: "https://www.youtube.com/@{{username}}",
    },
    {
        name: "Discord",
        icon: IconBrandDiscord,
        color: "#5865F2",
        key: "discord",
        template: "https://discord.com/users/{{username}}",
    }
]

export const SETTINGS = {
    career: {
        showNowLine: true,
        showNowLineText: true,
        showFutureOverlay: true,
    }
}

export const META: Meta = {
    name: "Colin Heggli",
    title: "Full Stack Developer",
    url: process.env.VERCEL_URL || "https://colin.heggli.dev",
    profiles: {
        email: "colin@heggli.dev",
        github: "M4rshe1",
        linkedin: "colin-heggli",
        discord: "633749833747922959",
        instagram: "m4rshe1_",
        youtube: "ColinHeggli",
        wakatime: "M4rshe1",
    },
}

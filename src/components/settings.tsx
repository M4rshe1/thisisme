"use client";

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {SettingsIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import {useLocale} from "use-intl";
import {useTranslations} from "next-intl";

const Settings = () => {
    const locale = useLocale();
    const t = useTranslations();

    const router = useRouter();

    const changeLanguage = (lang: string) => {
        if (locale !== lang) {
            router.push(`/${lang}`);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"accent"}><SettingsIcon/></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {t("settings.title")}
                    </DialogTitle>
                    <DialogDescription>
                        {t("settings.description")}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <Label>
                            {t("settings.language")}
                        </Label>
                        <div className="flex gap-2">
                            <Button
                                variant={locale === "en" ? "accent" : "outline"}
                                onClick={() => changeLanguage("en")}
                                className="flex items-center gap-2"
                            >
                                <span className="fi fi-gb"></span>
                                English
                            </Button>
                            <Button
                                variant={locale === "de" ? "accent" : "outline"}
                                onClick={() => changeLanguage("de")}
                                className="flex items-center gap-2"
                            >
                                <span className="fi fi-de"></span>
                                Deutsch
                            </Button>
                            <Button
                                variant={locale === "ch" ? "accent" : "outline"}
                                onClick={() => changeLanguage("ch")}
                                className="flex items-center gap-2"
                            >
                                <span className="fi fi-ch"></span>
                                Schwiizertütsch
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default Settings;
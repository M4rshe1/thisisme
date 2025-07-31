"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "use-intl";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const Settings = () => {
  const locale = useLocale();
  const t = useTranslations();
  const [mouseShadow, setMouseShadow] = useState(false);
  const [acrylicAnimation, setAcrylicAnimation] = useState(true);
  const router = useRouter();

  const changeLanguage = (lang: string) => {
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const currentHash = window.location.hash;
    const newPath = `/${lang}${currentPath.replace(`/${locale}`, "")}${currentSearch}${currentHash}`;
    router.push(newPath);
  };

  useEffect(() => {
    const mouseShadowStorage = localStorage.getItem("mouse-shadow");
    const acrylicAnimationStorage = localStorage.getItem("acrylic-animation");
    const mouseShadowValue = mouseShadowStorage === "true";
    const acrylicAnimationValue = acrylicAnimationStorage !== "false"; // Default to true
    setMouseShadow(mouseShadowValue);
    setAcrylicAnimation(acrylicAnimationValue);
  }, []);

  useEffect(() => {
    localStorage.setItem("mouse-shadow", mouseShadow.toString());
    window.dispatchEvent(
      new CustomEvent("localStorageChange", {
        detail: { key: "mouse-shadow", newValue: mouseShadow.toString() },
      })
    );
  }, [mouseShadow]);

  useEffect(() => {
    localStorage.setItem("acrylic-animation", acrylicAnimation.toString());
    window.dispatchEvent(
      new CustomEvent("localStorageChange", {
        detail: {
          key: "acrylic-animation",
          newValue: acrylicAnimation.toString(),
        },
      })
    );
  }, [acrylicAnimation]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"accent"}>
          <SettingsIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("settings.title")}</DialogTitle>
          <DialogDescription>{t("settings.description")}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label>{t("settings.mouseShadow")}</Label>
            <div className="flex gap-2">
              <Button
                variant={mouseShadow ? "accent" : "outline"}
                onClick={() => setMouseShadow(true)}
              >
                {t("settings.mouseShadowOn")}
              </Button>
              <Button
                variant={!mouseShadow ? "accent" : "outline"}
                onClick={() => setMouseShadow(false)}
              >
                {t("settings.mouseShadowOff")}
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2 max-md:col-span-2">
            <Label>{t("settings.acrylicAnimation")}</Label>
            <div className="flex gap-2">
              <Button
                variant={acrylicAnimation ? "accent" : "outline"}
                onClick={() => setAcrylicAnimation(true)}
              >
                {t("settings.acrylicAnimationOn")}
              </Button>
              <Button
                variant={!acrylicAnimation ? "accent" : "outline"}
                onClick={() => setAcrylicAnimation(false)}
              >
                {t("settings.acrylicAnimationOff")}
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full col-span-2">
            <Label>{t("settings.language")}</Label>
            <div className="flex gap-2 w-full flex-wrap">
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
  );
};

export default Settings;

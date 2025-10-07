"use client";

import Dot from "@/components/dot";
import React, { useState } from "react";
import { SOCIALS } from "@/config/settings";
import SocialBadge from "@/components/social-badge";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendContactEmail } from "@/actions/sendContactEmail";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { toast } from "sonner";

const Contact = () => {
  const t = useTranslations("contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const maxLength = 500;

  const {
    characterCount,
    handleChange,
    value,
    maxLength: limit,
  } = useCharacterLimit({ maxLength });

  const handleSubmit = async () => {
    if (!name || !email || !value) {
      toast.error(t("form.somethingEmpty"));
      return;
    }

    const data = {
      name,
      email,
      message: value,
    };

    const result = await sendContactEmail(data);

    if (result.success) {
      console.log(result.success);
      toast.success(t("form.success"));
      setName("");
      setEmail("");
      handleChange("");
    } else {
      toast.error(t("form.error"));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold">
        {t("title")}
        <Dot className={"ml-1"} />
      </h2>
      <p className="text-gray-400">{t("description")}</p>
      <form
        action={handleSubmit}
        className="flex flex-col gap-2 mt-4 w-full bg-black/30 rounded-md border border-gray-800 p-4 shadow-lg backdrop-blur-sm lg:grid lg:grid-cols-2 lg:gap-4"
      >
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-200 ">
            {t("form.name")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("form.placeholderName")}
          />
        </div>
        <div className={"space-y-2"}>
          <Label htmlFor="email" className="text-gray-200">
            {t("form.email")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            placeholder={t("form.placeholderEmail")}
          />
        </div>
        <div className="lg:col-span-2 space-y-2">
          <Label htmlFor="message" className="text-gray-200">
            {t("form.message")}
            <span className="text-red-500">*</span>
          </Label>
          <div className="*:not-first:mt-2">
            <Textarea
              id={"message"}
              value={value}
              placeholder={t("form.placeholderMessage")}
              maxLength={maxLength}
              rows={5}
              onChange={(e) => handleChange(e.target.value)}
            />
            <p
              className="text-muted-foreground mt-2 text-right text-xs"
              role="status"
              aria-live="polite"
            >
              <span className="tabular-nums">{limit - characterCount}</span>{" "}
              {t("form.charactersLeft")}
            </p>
          </div>
        </div>
        <Button
          disabled={!name || !email || !value}
          type="submit"
          variant={"default"}
          className={cn("ml-auto lg:col-span-2", {
            "cursor-not-allowed opacity-50": !name || !email || !value,
          })}
        >
          <Send /> {t("form.send")}
        </Button>
      </form>
      <div className="flex justify-center flex-col gap-2 mt-4">
        <p className={"text-gray-400"}>{t("otherOptions")}</p>
        <div className="flex gap-2 justify-start items-center gap-4 w-fit flex-wrap">
          {SOCIALS.map((social, index) => (
            <SocialBadge social={social} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;

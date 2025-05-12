"use client";

import Dot from "@/components/dot";
import React, {useState} from "react";
import {SOCIALS} from "@/lib/settings";
import SocialBadge from "@/components/social-badge";
import {useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {sendContactEmail} from "@/actions/sendContactEmail";
import {Send} from "lucide-react";
import {cn} from "@/lib/utils";
import {useCharacterLimit} from "@/hooks/use-character-limit";
import { toast } from 'sonner'

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
    } = useCharacterLimit({maxLength})


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
            toast.success(t("form.success"))
            setName("");
            setEmail("");
            handleChange("");
        } else {
            toast.error(t("form.error"));
        }
    };


    return (
        <div className="flex flex-col gap-4 my-8">
            <h2 className="text-3xl font-bold">
                {t("title")}
                <Dot className={"ml-1"}/>
            </h2>
            <p className="text-gray-400">
                {t("description")}
            </p>
            <form
                action={handleSubmit}
                className="flex flex-col gap-2 mt-4 w-full bg-black/30 rounded-md border border-gray-600 p-4 shadow-lg backdrop-blur-sm lg:grid lg:grid-cols-2 lg:gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-400 ">
                        {t("form.name")}
                    </Label>
                    <Input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-transparent border border-gray-600 rounded-md p-2 focus:outline-none focus:border-gray-400"
                        placeholder={t("form.placeholderName")}
                    />
                </div>
                <div className={"space-y-2"}>
                    <Label htmlFor="email" className="text-gray-400">
                        {t("form.email")}
                    </Label>
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        id="email"
                        className="bg-transparent border border-gray-600 rounded-md p-2 focus:outline-none focus:border-gray-400"
                        placeholder={t("form.placeholderEmail")}
                    />
                </div>
                <div className="lg:col-span-2 space-y-2">
                    <Label htmlFor="message" className="text-gray-400">
                        {t("form.message")}
                    </Label>
                    <div className="*:not-first:mt-2">
                        <Textarea
                            id={"message"}
                            value={value}
                            placeholder={t("form.placeholderMessage")}
                            maxLength={maxLength}
                            onChange={(e) => handleChange(e.target.value)}
                        />
                        <p
                            className="text-muted-foreground mt-2 text-right text-xs"
                            role="status"
                            aria-live="polite"
                        >
                            <span className="tabular-nums">{limit - characterCount}</span>{" "}
                            characters left
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
                    {t("form.send")} <Send/>
                </Button>
            </form>
            <div className="flex justify-center flex-col gap-2 mt-4">
                <p className={"text-gray-400"}>{
                    t("otherOptions")
                }</p>
                <div
                    className="flex gap-2 justify-start items-center gap-4 w-fit flex-wrap"
                >
                    {
                        SOCIALS.map((social, index) => (
                            <SocialBadge social={social} key={index}/>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default Contact;
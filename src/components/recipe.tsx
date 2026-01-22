"use client";

import { RECIPES } from "@/config/recipes";
import {
  Recipe as RecipeType,
  RecipeIngredient,
  Allergies,
} from "@/lib/recipes";
import { cn, toTitleCase } from "@/lib/utils";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useMessages, useTranslations } from "next-intl";
import React, { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { AllergyCircle } from "./allergy-circle";
import Dot from "@/components/dot";
import ShoppingList from "./shopping-list";
import { createShoppingList } from "@/lib/shopping-list";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ShoppingCart } from "lucide-react";

const Recipe = (props: {
  slug: string;
  searchParams: { servings?: string };
}) => {
  const messages = useMessages();
  const t = useTranslations("recipes");
  const recipeDict = RECIPES as Record<string, RecipeType>;
  const recipe = recipeDict[props.slug];
  if (!recipe) return notFound();
  const [servings, setServings] = useState(
    Number(props.searchParams?.servings ?? recipe.servings)
  );

  const scale = servings / recipe.servings;

  const recipesMessages = messages?.recipes ?? {};
  const namedRecipes = recipesMessages?.recipes ?? {};
  const recipeMessages = namedRecipes?.[props.slug] ?? {};

  const displayName =
    namedRecipes?.[props.slug]?.name ?? toTitleCase(props.slug);
  const description = namedRecipes?.[props.slug]?.description ?? "";
  const story = namedRecipes?.[props.slug]?.story ?? "";

  const shoppingListItems = useMemo(() => {
    return createShoppingList([
      { slug: props.slug, recipe, servings },
    ]);
  }, [props.slug, recipe, servings]);

  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [showShoppingList, setShowShoppingList] = useState(false);

  const handleItemToggle = (ingredient: string, checked: boolean) => {
    const newChecked = new Set(checkedItems);
    if (checked) {
      newChecked.add(ingredient);
    } else {
      newChecked.delete(ingredient);
    }
    setCheckedItems(newChecked);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="h-8" />
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">
          {displayName}
          <Dot className={"ml-1"} />
        </h1>
        {description && <p className="text-gray-400">{description}</p>}
      </div>

      <div className="relative w-full overflow-hidden rounded-xl border border-gray-800 aspect-video">
        <Image
          alt={displayName}
          src={`/images/recipes/${props.slug}.jpg`}
          width={600}
          height={300}
          className="h-auto w-full object-cover aspect-video"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            <h2 className="text-2xl font-semibold">
              {t("titles.ingredients")}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {recipe.allergies && (
                <span className="rounded-full bg-gray-300/30 h-2 w-2"></span>
              )}
              {Object.keys(recipe.allergies ?? {}).map((allergy) => (
                <AllergyCircle
                  key={allergy}
                  allergy={allergy as keyof Allergies}
                />
              ))}
            </div>
            <Dialog open={showShoppingList} onOpenChange={setShowShoppingList}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {t("shoppingList.viewList") ?? "View Shopping List"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {t("shoppingList.title") ?? "Shopping List"}
                  </DialogTitle>
                </DialogHeader>
                <ShoppingList
                  items={shoppingListItems}
                  onItemToggle={handleItemToggle}
                  checkedItems={checkedItems}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div
            className={cn("pl-6 space-y-2 grid grid-cols-[auto_1fr] gap-x-4")}
          >
            {recipe.ingredients.map((ing: RecipeIngredient, idx: number) => {
              const q = Math.round(ing.quantity * scale * 10) / 10;
              const name =
                t(`ingredients.${ing.ingredient}`) ??
                toTitleCase(ing.ingredient);
              return (
                <React.Fragment key={idx}>
                  <div
                    className={cn(
                      "text-white",
                      ing.optional && "text-gray-400"
                    )}
                  >
                    {q} {t(`units.${ing.unit}`)}
                  </div>
                  <div
                    key={idx}
                    className={cn(
                      "text-gray-300",
                      ing.optional && "text-gray-600"
                    )}
                  >
                    {name}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-md border border-gray-800 bg-black/30 p-3">
              <div className="text-gray-400">{t("titles.servings")}</div>
              <div className="flex items-center justify-between gap-2 w-full mt-2">
                <Button
                  variant={"outline"}
                  onClick={() => setServings((prev) => Math.max(1, prev - 1))}
                  size={"sm"}
                >
                  -
                </Button>
                <div className="text-lg font-semibold text-center">
                  {servings}
                </div>
                <Button
                  variant={"outline"}
                  onClick={() => setServings((prev) => prev + 1)}
                  size={"sm"}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="rounded-md border border-gray-800 bg-black/30 p-3">
              <div className="text-gray-400">{t("titles.preparationTime")}</div>
              <div className="text-lg font-semibold">
                {recipe.preparationTime}m
              </div>
            </div>
            <div className="rounded-md border border-gray-800 bg-black/30 p-3">
              <div className="text-gray-400">{t("titles.cookingTime")}</div>
              <div className="text-lg font-semibold">{recipe.cookingTime}m</div>
            </div>
            <div className="rounded-md border border-gray-800 bg-black/30 p-3">
              <div className="text-gray-400">{t("titles.totalTime")}</div>
              <div className="text-lg font-semibold">{recipe.totalTime}m</div>
            </div>
          </div>
          {recipe.relatedRecipes?.length ? (
            <div className="rounded-md border border-gray-800 bg-black/30 p-3 text-sm text-gray-300">
              <div className="text-gray-400 mb-1">{t("titles.related")}</div>
              <div className="flex flex-wrap gap-2">
                {recipe.relatedRecipes.map((r) => {
                  const doesNotExist = !namedRecipes?.[r];
                  return (
                    <a
                      key={r}
                      href={`/recipes/${r}`}
                      className={cn(
                        "underline hover:no-underline",
                        doesNotExist && "text-red-400"
                      )}
                    >
                      {namedRecipes?.[r]?.name ?? toTitleCase(r)}
                    </a>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
        <div className="md:col-span-2 flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">{t("titles.instructions")}</h2>
          <div className="pl-6 space-y-2 grid grid-cols-[auto_1fr] gap-x-4">
            {recipeMessages?.instructions?.map((i: string, idx: number) => (
              <React.Fragment key={idx}>
                <div className="text-white">{idx + 1}.</div>
                <div className="text-gray-300">{i}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {story && (
        <div className="rounded-md border border-gray-800/50 bg-black/20 p-4 mt-2">
          <h3 className="text-sm text-gray-400 mb-2 font-bold">
            {t("titles.story") ?? "The Story"}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
            {story}
          </p>
        </div>
      )}
    </div>
  );
};

export default Recipe;

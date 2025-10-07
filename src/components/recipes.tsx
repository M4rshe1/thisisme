"use client";

import React, { useEffect, useMemo, useState } from "react";
import { RECIPES } from "@/config/recipes";
import { Link } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Dot from "@/components/dot";
import { useMessages, useTranslations } from "next-intl";
import Image from "next/image";
import { cn, toTitleCase } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AllergyCircle } from "./allergy-circle";
import { Allergies } from "@/lib/recipes";

type RecipeEntry = {
  slug: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

const Recipes: React.FC = () => {
  const t = useTranslations("recipes");
  const messages = useMessages() as unknown as Record<string, unknown>;
  const recipesMessages = (messages?.recipes ?? {}) as Record<string, unknown>;
  const namedRecipes = (recipesMessages?.recipes ?? {}) as Record<
    string,
    { name?: string; description?: string } | undefined
  >;
  const ingredientsMessages = (recipesMessages?.ingredients ?? {}) as Record<
    string,
    string | undefined
  >;

  const allRecipes: RecipeEntry[] = useMemo(
    () => Object.entries(RECIPES).map(([slug, data]) => ({ slug, data })),
    []
  );

  const kitchens = useMemo(
    () => Array.from(new Set(allRecipes.map((r) => r.data.kitchen))).sort(),
    [allRecipes]
  );

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [kitchenFilter, setKitchenFilter] = useState<string>("all");
  const [excludeLactose, setExcludeLactose] = useState(false);
  const [excludeGluten, setExcludeGluten] = useState(false);
  const [excludeEgg, setExcludeEgg] = useState(false);
  const [excludeSoy, setExcludeSoy] = useState(false);
  const [excludeNuts, setExcludeNuts] = useState(false);
  const [sortBy, setSortBy] = useState<"Name" | "Time" | "Kitchen">("Name");
  const [sortOrder, setSortOrder] = useState<"Asc" | "Desc">("Asc");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(id);
  }, [query]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const f = allRecipes.filter((r) => {
      if (kitchenFilter !== "all" && r.data.kitchen !== kitchenFilter)
        return false;

      // allergy filters: exclude recipes that explicitly contain the allergen
      const a = r.data.allergies ?? {};
      if (excludeLactose && a.lactose) return false;
      if (excludeGluten && a.gluten) return false;
      if (excludeEgg && a.egg) return false;
      if (excludeSoy && a.soy) return false;
      if (excludeNuts && a.nuts) return false;

      if (!q) return true;

      const displayName = namedRecipes?.[r.slug]?.name ?? toTitleCase(r.slug);
      if (displayName.toLowerCase().includes(q)) return true;

      // search in ingredients (either translated or raw key)
      const ingredientNames = r.data.ingredients.map(
        (i: { ingredient: string }) => {
          return (
            ingredientsMessages?.[i.ingredient] ?? toTitleCase(i.ingredient)
          ).toLowerCase();
        }
      );
      return ingredientNames.some((n: string) => n.includes(q));
    });

    const sorted = [...f].sort((a, b) => {
      if (sortBy === "Name") {
        const an = (
          namedRecipes?.[a.slug]?.name ?? toTitleCase(a.slug)
        ).toLowerCase();
        const bn = (
          namedRecipes?.[b.slug]?.name ?? toTitleCase(b.slug)
        ).toLowerCase();
        return an.localeCompare(bn);
      }
      if (sortBy === "Kitchen") {
        const ak = String(a.data.kitchen).toLowerCase();
        const bk = String(b.data.kitchen).toLowerCase();
        return ak.localeCompare(bk);
      }
      // time
      return Number(a.data.totalTime) - Number(b.data.totalTime);
    });

    return sortOrder === "Asc" ? sorted : sorted.reverse();
  }, [
    allRecipes,
    debouncedQuery,
    kitchenFilter,
    excludeEgg,
    excludeGluten,
    excludeLactose,
    excludeNuts,
    excludeSoy,
    ingredientsMessages,
    namedRecipes,
    sortBy,
    sortOrder,
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold">
          {t("title")}
          <Dot className={"ml-1"} />
        </h2>
        <p className="text-gray-400">{t("description")}</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex flex-col items-start gap-2">
            <span className="text-sm text-gray-400 shrink-0">
              {t("filter.search")}
            </span>
            <Input
              placeholder={t("filter.searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="text-sm text-gray-400 shrink-0">
              {t("filter.kitchen")}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>
                    {kitchenFilter === "all"
                      ? t("filter.all")
                      : toTitleCase(kitchenFilter)}
                  </span>
                  <span className="text-gray-500">▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>
                  {t("filter.selectKitchen")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={kitchenFilter}
                  onValueChange={(v: string) => setKitchenFilter(v)}
                >
                  <DropdownMenuRadioItem value="all">
                    {t("filter.all")}
                  </DropdownMenuRadioItem>
                  {kitchens.map((k) => (
                    <DropdownMenuRadioItem key={k} value={k}>
                      {toTitleCase(k)}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-col items-start gap-2">
            <label className="text-sm text-gray-400">
              {t("filter.allergens")}
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>
                    {[
                      excludeLactose && "Lactose",
                      excludeGluten && "Gluten",
                      excludeEgg && "Egg",
                      excludeSoy && "Soy",
                      excludeNuts && "Nuts",
                    ]
                      .filter(Boolean)
                      .join(", ") || t("filter.none")}
                  </span>
                  <span className="text-gray-500">▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>{t("filter.exclude")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  className="flex items-center gap-2"
                  checked={excludeLactose}
                  onCheckedChange={(v: boolean) =>
                    setExcludeLactose(Boolean(v))
                  }
                >
                  <AllergyCircle allergy="lactose" />
                  {t("allergens.lactose")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  className="flex items-center gap-2"
                  checked={excludeGluten}
                  onCheckedChange={(v: boolean) => setExcludeGluten(Boolean(v))}
                >
                  <AllergyCircle allergy="gluten" />
                  {t("allergens.gluten")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  className="flex items-center gap-2"
                  checked={excludeEgg}
                  onCheckedChange={(v: boolean) => setExcludeEgg(Boolean(v))}
                >
                  <AllergyCircle allergy="egg" />
                  {t("allergens.egg")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  className="flex items-center gap-2"
                  checked={excludeSoy}
                  onCheckedChange={(v: boolean) => setExcludeSoy(Boolean(v))}
                >
                  <AllergyCircle allergy="soy" />
                  {t("allergens.soy")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  className="flex items-center gap-2"
                  checked={excludeNuts}
                  onCheckedChange={(v: boolean) => setExcludeNuts(Boolean(v))}
                >
                  <AllergyCircle allergy="nuts" />
                  {t("allergens.nuts")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    setExcludeEgg(false);
                    setExcludeGluten(false);
                    setExcludeLactose(false);
                    setExcludeNuts(false);
                    setExcludeSoy(false);
                  }}
                >
                  {t("filter.clear")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2 w-full md:col-span-3">
            <label className="text-sm text-gray-400">{t("filter.sort")}</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between">
                  {t(`filter.sortBy${sortBy}`)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>{t("filter.sortBy")}</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={sortBy}
                  onValueChange={(v: string) => setSortBy(v as any)}
                >
                  <DropdownMenuRadioItem value="Name">
                    {t("filter.sortByName")}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Time">
                    {t("filter.sortByTime")}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Kitchen">
                    {t("filter.sortByKitchen")}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-2 w-full">
              <Button
                variant="outline"
                onClick={() =>
                  setSortOrder(sortOrder === "Asc" ? "Desc" : "Asc")
                }
              >
                {t(`filter.sortOrder${sortOrder}`)}
              </Button>
              <Button
                variant="outline"
                className="ml-auto"
                onClick={() => {
                  setQuery("");
                  setKitchenFilter("all");
                  setExcludeEgg(false);
                  setExcludeGluten(false);
                  setExcludeLactose(false);
                  setExcludeNuts(false);
                  setExcludeSoy(false);
                  setSortBy("Name");
                  setSortOrder("Asc");
                }}
              >
                {t("filter.resetFilters")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(({ slug, data }) => {
          const displayName = namedRecipes?.[slug]?.name ?? toTitleCase(slug);
          const description = namedRecipes?.[slug]?.description ?? "";
          return (
            <Link
              key={slug}
              href={`/recipes/${slug}`}
              className={cn(
                "group overflow-hidden rounded-xl border border-gray-800 hover:border-gray-700 transition-colors",
                "bg-black/30"
              )}
            >
              <div className="relative w-full aspect-[16/9] overflow-hidden">
                <Image
                  alt={displayName}
                  src={`/images/recipes/${slug}.jpg`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-lg font-semibold group-hover:underline">
                  {displayName}
                </h3>
                {description && (
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {description}
                  </p>
                )}
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                  <span className="rounded-full border border-gray-700 px-2 py-0.5">
                    {toTitleCase(data.kitchen)}
                  </span>
                  <span className="rounded-full border border-gray-700 px-2 py-0.5">
                    {data.totalTime}m
                  </span>
                  {data.allergies && (
                    <span className="rounded-full bg-gray-300/30 px-0.5 py-0.5"></span>
                  )}
                  {Object.keys(data.allergies ?? {}).map((allergy) => (
                    <AllergyCircle
                      key={allergy}
                      allergy={allergy as keyof Allergies}
                    />
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-sm text-gray-400">
            {t("filter.noRecipesMatchFilters")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;

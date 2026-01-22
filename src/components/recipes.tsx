"use client";

import React, { useEffect, useMemo, useState } from "react";
import { RECIPES } from "@/config/recipes";
import { Link } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Dot from "@/components/dot";
import { useMessages, useTranslations } from "next-intl";
import { cn, toTitleCase } from "@/lib/utils";
import RecipeImage from "./recipe-image";
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
  const [sortBy, setSortBy] = useState<"Name" | "Time" | "Kitchen" | "Created">(
    "Name"
  );
  const [sortOrder, setSortOrder] = useState<"Asc" | "Desc">("Asc");
  const [selectedRecipes, setSelectedRecipes] = useState<Set<string>>(
    new Set()
  );
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const shoppingListItems = useMemo(() => {
    const selected = Array.from(selectedRecipes)
      .map((slug) => {
        const recipe = RECIPES[slug];
        return recipe ? { slug, recipe } : null;
      })
      .filter((r): r is { slug: string; recipe: any } => r !== null);

    return createShoppingList(selected);
  }, [selectedRecipes]);

  const toggleRecipeSelection = (slug: string) => {
    const newSelected = new Set(selectedRecipes);
    if (newSelected.has(slug)) {
      newSelected.delete(slug);
    } else {
      newSelected.add(slug);
    }
    setSelectedRecipes(newSelected);
  };

  const handleItemToggle = (ingredient: string, checked: boolean) => {
    const newChecked = new Set(checkedItems);
    if (checked) {
      newChecked.add(ingredient);
    } else {
      newChecked.delete(ingredient);
    }
    setCheckedItems(newChecked);
  };

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(id);
  }, [query]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const f = allRecipes.filter((r) => {
      // Kitchen filter
      if (kitchenFilter !== "all" && r.data.kitchen !== kitchenFilter)
        return false;

      // Allergy filters: exclude recipes that explicitly contain the allergen
      const a = r.data.allergies ?? {};
      if (excludeLactose && a.lactose) return false;
      if (excludeGluten && a.gluten) return false;
      if (excludeEgg && a.egg) return false;
      if (excludeSoy && a.soy) return false;
      if (excludeNuts && a.nuts) return false;

      // Search query
      if (!q) return true;

      const displayName = namedRecipes?.[r.slug]?.name ?? toTitleCase(r.slug);
      const description =
        namedRecipes?.[r.slug]?.description ?? "";

      // Search in name
      if (displayName.toLowerCase().includes(q)) return true;

      // Search in description
      if (description.toLowerCase().includes(q)) return true;

      // Search in ingredients (either translated or raw key)
      const ingredientNames = r.data.ingredients.map(
        (i: { ingredient: string }) => {
          return (
            ingredientsMessages?.[i.ingredient] ?? toTitleCase(i.ingredient)
          ).toLowerCase();
        }
      );
      if (ingredientNames.some((n: string) => n.includes(q))) return true;

      // Search in kitchen type
      const kitchenName = t(`kitchen.${r.data.kitchen}`) ?? toTitleCase(r.data.kitchen);
      if (kitchenName.toLowerCase().includes(q)) return true;

      return false;
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
      if (sortBy === "Created") {
        const ad = a.data.dateCreated;
        const bd = b.data.dateCreated;
        return ad.localeCompare(bd);
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">
            {t("title")}
            <Dot className={"ml-1"} />
          </h2>
          <p className="text-gray-400">{t("description")}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {selectedRecipes.size > 0 && (
            <Dialog open={showShoppingList} onOpenChange={setShowShoppingList}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {t("shoppingList.viewList") ?? "View Shopping List"} (
                  {selectedRecipes.size})
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
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
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-300">
                {t("filter.search") ?? "Search"}
              </span>
              {query && (
                <span className="text-xs text-gray-500">
                  ({filtered.length} {t("filter.results") ?? "results"})
                </span>
              )}
            </div>
            <Input
              placeholder={t("filter.searchPlaceholder") ?? "Search recipes by name, description, ingredients, or kitchen..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Kitchen Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="justify-between min-w-[140px]">
                <span className="text-sm">
                  {kitchenFilter === "all"
                    ? t("filter.kitchen") ?? "Kitchen"
                    : t(`kitchen.${kitchenFilter}`) ?? toTitleCase(kitchenFilter)}
                </span>
                <span className="text-gray-500 ml-2">▼</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>
                {t("filter.selectKitchen") ?? "Select Kitchen"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={kitchenFilter}
                onValueChange={(v: string) => setKitchenFilter(v)}
              >
                <DropdownMenuRadioItem value="all">
                  {t("filter.all") ?? "All"}
                </DropdownMenuRadioItem>
                {kitchens.map((k) => (
                  <DropdownMenuRadioItem key={k} value={k}>
                    {t(`kitchen.${k}`) ?? toTitleCase(k)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Allergens Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="justify-between min-w-[140px]">
                <span className="text-sm">
                  {(() => {
                    const activeAllergens = [
                      excludeLactose && t("allergens.lactose"),
                      excludeGluten && t("allergens.gluten"),
                      excludeEgg && t("allergens.egg"),
                      excludeSoy && t("allergens.soy"),
                      excludeNuts && t("allergens.nuts"),
                    ].filter(Boolean) as string[];
                    const activeCount = activeAllergens.length;
                    const displayText = activeAllergens.slice(0, 2).join(", ");
                    const fallback = t("filter.allergens") ?? "Allergens";
                    return (
                      (displayText || fallback) +
                      (activeCount > 2 ? ` +${activeCount - 2}` : "")
                    );
                  })()}
                </span>
                <span className="text-gray-500 ml-2">▼</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>
                {t("filter.exclude") ?? "Exclude Allergens"}
              </DropdownMenuLabel>
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
                {t("filter.clear") ?? "Clear All"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-400">
              {t("filter.sort") ?? "Sort:"}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between min-w-[120px]">
                  <span className="text-sm">
                    {t(`filter.sortBy${sortBy}`) ?? sortBy}
                  </span>
                  <span className="text-gray-500 ml-2">▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>
                  {t("filter.sortBy") ?? "Sort By"}
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={sortBy}
                  onValueChange={(v: string) => setSortBy(v as any)}
                >
                  <DropdownMenuRadioItem value="Name">
                    {t("filter.sortByName") ?? "Name"}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Time">
                    {t("filter.sortByTime") ?? "Time"}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Kitchen">
                    {t("filter.sortByKitchen") ?? "Kitchen"}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Created">
                    {t("filter.sortByCreated") ?? "Created"}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setSortOrder(sortOrder === "Asc" ? "Desc" : "Asc")
              }
              title={t(`filter.sortOrder${sortOrder}`) ?? sortOrder}
            >
              {sortOrder === "Asc" ? "↑" : "↓"}
            </Button>
            {(query ||
              kitchenFilter !== "all" ||
              excludeLactose ||
              excludeGluten ||
              excludeEgg ||
              excludeSoy ||
              excludeNuts ||
              sortBy !== "Name" ||
              sortOrder !== "Asc") && (
              <Button
                variant="outline"
                size="sm"
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
                {t("filter.resetFilters") ?? "Reset"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(({ slug, data }) => {
          const displayName = namedRecipes?.[slug]?.name ?? toTitleCase(slug);
          const description = namedRecipes?.[slug]?.description ?? "";
          const isSelected = selectedRecipes.has(slug);
          return (
            <div
              key={slug}
              className={cn(
                "group overflow-hidden flex flex-col rounded-xl border transition-colors relative",
                isSelected
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-800 hover:border-gray-700 bg-black/30"
              )}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleRecipeSelection(slug);
                }}
                className={cn(
                  "absolute top-2 right-2 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  isSelected
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-black/50 border-gray-600 text-gray-400 hover:border-gray-500"
                )}
                title={
                  isSelected
                    ? t("shoppingList.deselect") ?? "Deselect"
                    : t("shoppingList.select") ?? "Select for shopping list"
                }
              >
                {isSelected && "✓"}
              </button>
              <Link
                href={`/recipes/${slug}`}
                className="flex flex-col flex-1"
              >
              <div className="relative w-full aspect-video overflow-hidden bg-gray-900">
                <RecipeImage
                  slug={slug}
                  alt={displayName}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-4 flex flex-col justify-between gap-2 flex-1 w-full">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold group-hover:underline">
                    {displayName}
                  </h3>
                  {description && (
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {description}
                    </p>
                  )}
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-gray-400">
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
            </div>
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

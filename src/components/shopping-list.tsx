"use client";

import React, { useMemo, useState } from "react";
import { ShoppingListItem, groupByStorageLocation } from "@/lib/shopping-list";
import { useTranslations, useMessages } from "next-intl";
import { toTitleCase } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronDown, ShoppingCart, CheckCircle2, Circle } from "lucide-react";

interface ShoppingListProps {
  items: ShoppingListItem[];
  onItemToggle?: (ingredient: string, checked: boolean) => void;
  checkedItems?: Set<string>;
  showStorageGroups?: boolean;
  showRecipes?: boolean;
}

const ShoppingList: React.FC<ShoppingListProps> = ({
  items,
  onItemToggle,
  checkedItems = new Set(),
  showStorageGroups = true,
  showRecipes = true,
}) => {
  const t = useTranslations("recipes");
  const messages = useMessages();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["pantry", "refrigerator", "spiceRack"])
  );

  const ingredientsMessages = (messages?.recipes?.ingredients ??
    {}) as Record<string, string | undefined>;
  const recipesMessages = (messages?.recipes?.recipes ??
    {}) as Record<string, { name?: string } | undefined>;

  const groupedItems = useMemo(() => {
    if (!showStorageGroups) return { all: items };
    const grouped = groupByStorageLocation(items);
    return Object.keys(grouped).length > 0 ? grouped : { all: items };
  }, [items, showStorageGroups]);

  const storageLocationLabels: Record<string, string> = {
    pantry: t("shoppingList.storage.pantry") ?? "Pantry",
    refrigerator: t("shoppingList.storage.refrigerator") ?? "Refrigerator",
    freezer: t("shoppingList.storage.freezer") ?? "Freezer",
    spiceRack: t("shoppingList.storage.spiceRack") ?? "Spice Rack",
    counter: t("shoppingList.storage.counter") ?? "Counter",
    other: t("shoppingList.storage.other") ?? "Other",
    all: t("shoppingList.all") ?? "All Items",
  };

  const toggleGroup = (location: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(location)) {
      newExpanded.delete(location);
    } else {
      newExpanded.add(location);
    }
    setExpandedGroups(newExpanded);
  };

  const formatQuantity = (quantity: number, unit: string): string => {
    const rounded = Math.round(quantity * 10) / 10;
    return `${rounded} ${t(`units.${unit}`) ?? unit}`;
  };

  const getIngredientName = (ingredientId: string): string => {
    return (
      ingredientsMessages[ingredientId] ??
      t(`ingredients.${ingredientId}`) ??
      toTitleCase(ingredientId)
    );
  };

  const getRecipeName = (slug: string): string => {
    return (
      recipesMessages[slug]?.name ??
      t(`recipes.${slug}.name`) ??
      toTitleCase(slug)
    );
  };

  if (items.length === 0) {
    return (
      <div className="rounded-md border border-gray-800 bg-black/30 p-6 text-center text-gray-400">
        <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>{t("shoppingList.empty") ?? "No items in shopping list"}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-5 w-5 text-gray-400" />
        <h2 className="text-2xl font-semibold">
          {t("shoppingList.title") ?? "Shopping List"}
        </h2>
        <span className="text-sm text-gray-400">
          ({items.length} {t("shoppingList.items") ?? "items"})
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {Object.entries(groupedItems).map(([location, locationItems]) => {
          const isExpanded = expandedGroups.has(location);
          const locationLabel = storageLocationLabels[location] ?? location;

          return (
            <Collapsible
              key={location}
              open={isExpanded}
              onOpenChange={() => toggleGroup(location)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-black/30 hover:bg-black/50"
                >
                  <span className="font-medium">{locationLabel}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {locationItems.length}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 space-y-2 pl-2 border-l-2 border-gray-800">
                  {locationItems.map((item, idx) => {
                    const isChecked = checkedItems.has(
                      `${item.ingredient}-${item.unit}`
                    );
                    const ingredientName = getIngredientName(item.ingredient);

                    return (
                      <div
                        key={`${item.ingredient}-${item.unit}-${idx}`}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-md border border-gray-800 bg-black/20",
                          isChecked && "opacity-60"
                        )}
                      >
                        {onItemToggle && (
                          <button
                            onClick={() =>
                              onItemToggle(
                                `${item.ingredient}-${item.unit}`,
                                !isChecked
                              )
                            }
                            className="mt-0.5 text-gray-400 hover:text-gray-200 transition-colors"
                          >
                            {isChecked ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <Circle className="h-5 w-5" />
                            )}
                          </button>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={cn(
                                "font-medium",
                                item.optional && "text-gray-400",
                                isChecked && "line-through"
                              )}
                            >
                              {formatQuantity(item.totalQuantity, item.unit)}
                            </span>
                            <span
                              className={cn(
                                item.optional && "text-gray-500",
                                isChecked && "line-through"
                              )}
                            >
                              {ingredientName}
                            </span>
                            {item.optional && (
                              <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded">
                                {t("shoppingList.optional") ?? "Optional"}
                              </span>
                            )}
                          </div>
                          {showRecipes && item.recipes.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              <span className="text-xs text-gray-500">
                                {t("shoppingList.for") ?? "for"}:
                              </span>
                              {item.recipes.map((recipeSlug, recipeIdx) => (
                                <span
                                  key={recipeSlug}
                                  className="text-xs text-gray-400 bg-gray-800/30 px-2 py-0.5 rounded"
                                >
                                  {getRecipeName(recipeSlug)}
                                  {recipeIdx < item.recipes.length - 1 && ","}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};

export default ShoppingList;

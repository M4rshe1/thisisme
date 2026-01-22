import { RecipeIngredient, RecipeUnit } from "./recipes";
import { Recipe } from "./recipes";
import { getIngredientMetadata } from "./ingredients";

/**
 * Aggregated shopping list item
 */
export interface ShoppingListItem {
  ingredient: string;
  totalQuantity: number;
  unit: RecipeUnit;
  recipes: string[]; // recipe slugs that need this ingredient
  optional: boolean;
  category?: string;
  storageLocation?: string;
  isPerishable?: boolean;
}

/**
 * Aggregate ingredients from multiple recipes into a shopping list
 */
export function createShoppingList(
  recipes: Array<{ slug: string; recipe: Recipe; servings?: number }>
): ShoppingListItem[] {
  const aggregated: Map<string, ShoppingListItem> = new Map();

  recipes.forEach(({ slug, recipe, servings = recipe.servings }) => {
    const scale = servings / recipe.servings;

    recipe.ingredients.forEach((ing: RecipeIngredient) => {
      const key = `${ing.ingredient}-${ing.unit}`;
      const scaledQuantity = ing.quantity * scale;

      if (aggregated.has(key)) {
        const existing = aggregated.get(key)!;
        existing.totalQuantity += scaledQuantity;
        if (!existing.recipes.includes(slug)) {
          existing.recipes.push(slug);
        }
        // If any recipe marks it as optional, keep it optional
        if (ing.optional) {
          existing.optional = true;
        }
      } else {
        const metadata = getIngredientMetadata(ing.ingredient);
        aggregated.set(key, {
          ingredient: ing.ingredient,
          totalQuantity: scaledQuantity,
          unit: ing.unit,
          recipes: [slug],
          optional: ing.optional ?? false,
          category: metadata?.category,
          storageLocation: metadata?.storageLocation,
          isPerishable: metadata?.isPerishable,
        });
      }
    });
  });

  return Array.from(aggregated.values()).sort((a, b) => {
    // Sort by storage location first, then by category, then by name
    const locationOrder = [
      "pantry",
      "spiceRack",
      "refrigerator",
      "freezer",
      "counter",
      "other",
    ];
    const aLocationIndex = locationOrder.indexOf(a.storageLocation || "other");
    const bLocationIndex = locationOrder.indexOf(b.storageLocation || "other");

    if (aLocationIndex !== bLocationIndex) {
      return aLocationIndex - bLocationIndex;
    }

    const aCategory = a.category || "other";
    const bCategory = b.category || "other";
    if (aCategory !== bCategory) {
      return aCategory.localeCompare(bCategory);
    }

    return a.ingredient.localeCompare(b.ingredient);
  });
}

/**
 * Group shopping list items by storage location
 */
export function groupByStorageLocation(
  items: ShoppingListItem[]
): Record<string, ShoppingListItem[]> {
  const grouped: Record<string, ShoppingListItem[]> = {};

  items.forEach((item) => {
    const location = item.storageLocation || "other";
    if (!grouped[location]) {
      grouped[location] = [];
    }
    grouped[location].push(item);
  });

  return grouped;
}

/**
 * Group shopping list items by category
 */
export function groupByCategory(
  items: ShoppingListItem[]
): Record<string, ShoppingListItem[]> {
  const grouped: Record<string, ShoppingListItem[]> = {};

  items.forEach((item) => {
    const category = item.category || "other";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(item);
  });

  return grouped;
}

/**
 * Filter out optional items
 */
export function filterRequiredOnly(
  items: ShoppingListItem[]
): ShoppingListItem[] {
  return items.filter((item) => !item.optional);
}

/**
 * Get total estimated cost (if prices are available)
 */
export function estimateTotalCost(items: ShoppingListItem[]): number | null {
  // This is a placeholder - would need price data from ingredient registry
  return null;
}

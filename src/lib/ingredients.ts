import { RecipeUnit } from "@/lib/recipes";

/**
 * Ingredient categories for better organization
 */
export type IngredientCategory =
  | "protein"
  | "vegetable"
  | "fruit"
  | "dairy"
  | "grain"
  | "spice"
  | "condiment"
  | "oil"
  | "beverage"
  | "meat"
  | "other";

/**
 * Storage location for ingredients
 */
export type StorageLocation =
  | "pantry"
  | "refrigerator"
  | "freezer"
  | "spiceRack"
  | "counter"
  | "other";

/**
 * Ingredient metadata for better management
 */
export interface IngredientMetadata {
  id: string;
  category: IngredientCategory;
  storageLocation: StorageLocation;
  shelfLife?: number; // days
  defaultUnit?: RecipeUnit;
  notes?: string;
  isPerishable: boolean;
  typicalPrice?: number; // in your currency
}

/**
 * Central ingredient registry with metadata
 */
export const INGREDIENT_REGISTRY: Record<string, IngredientMetadata> = {
  chickenBreast: {
    id: "chickenBreast",
    category: "protein",
    storageLocation: "refrigerator",
    shelfLife: 2,
    defaultUnit: "g",
    isPerishable: true,
  },
  garlic: {
    id: "garlic",
    category: "vegetable",
    storageLocation: "pantry",
    shelfLife: 30,
    defaultUnit: "clove",
    isPerishable: false,
  },
  corianderPowder: {
    id: "corianderPowder",
    category: "spice",
    storageLocation: "spiceRack",
    defaultUnit: "tbsp",
    isPerishable: false,
  },
  cuminPowder: {
    id: "cuminPowder",
    category: "spice",
    storageLocation: "spiceRack",
    defaultUnit: "tbsp",
    isPerishable: false,
  },
  curryPowder: {
    id: "curryPowder",
    category: "spice",
    storageLocation: "spiceRack",
    defaultUnit: "tbsp",
    isPerishable: false,
  },
  turmericPowder: {
    id: "turmericPowder",
    category: "spice",
    storageLocation: "spiceRack",
    defaultUnit: "tbsp",
    isPerishable: false,
  },
  yogurt: {
    id: "yogurt",
    category: "dairy",
    storageLocation: "refrigerator",
    shelfLife: 7,
    defaultUnit: "g",
    isPerishable: true,
  },
  butter: {
    id: "butter",
    category: "dairy",
    storageLocation: "refrigerator",
    shelfLife: 30,
    defaultUnit: "g",
    isPerishable: true,
  },
  onion: {
    id: "onion",
    category: "vegetable",
    storageLocation: "pantry",
    shelfLife: 60,
    defaultUnit: "pcs",
    isPerishable: false,
  },
  tomato: {
    id: "tomato",
    category: "vegetable",
    storageLocation: "counter",
    shelfLife: 7,
    defaultUnit: "pcs",
    isPerishable: true,
  },
  cream: {
    id: "cream",
    category: "dairy",
    storageLocation: "refrigerator",
    shelfLife: 5,
    defaultUnit: "ml",
    isPerishable: true,
  },
  springOnion: {
    id: "springOnion",
    category: "vegetable",
    storageLocation: "refrigerator",
    shelfLife: 5,
    defaultUnit: "pcs",
    isPerishable: true,
  },
  egg: {
    id: "egg",
    category: "protein",
    storageLocation: "refrigerator",
    shelfLife: 21,
    defaultUnit: "pcs",
    isPerishable: true,
  },
  rice: {
    id: "rice",
    category: "grain",
    storageLocation: "pantry",
    defaultUnit: "cup",
    isPerishable: false,
  },
  water: {
    id: "water",
    category: "beverage",
    storageLocation: "counter",
    defaultUnit: "ml",
    isPerishable: false,
  },
  soySauce: {
    id: "soySauce",
    category: "condiment",
    storageLocation: "refrigerator",
    shelfLife: 365,
    defaultUnit: "tbsp",
    isPerishable: false,
  },
  salt: {
    id: "salt",
    category: "spice",
    storageLocation: "spiceRack",
    defaultUnit: "tsp",
    isPerishable: false,
  },
  zweifelPaprikaPowder: {
    id: "zweifelPaprikaPowder",
    category: "spice",
    storageLocation: "spiceRack",
    defaultUnit: "can",
    isPerishable: false,
  },
  zucchini: {
    id: "zucchini",
    category: "vegetable",
    storageLocation: "refrigerator",
    shelfLife: 5,
    defaultUnit: "pcs",
    isPerishable: true,
  },
  beefMince: {
    id: "beefMince",
    category: "meat",
    storageLocation: "refrigerator",
    shelfLife: 5,
    defaultUnit: "g",
    isPerishable: true,
  },
  carrot: {
    id: "carrot",
    category: "vegetable",
    storageLocation: "refrigerator",
    shelfLife: 5,
    defaultUnit: "pcs",
    isPerishable: true,
  },
  potato: {
    id: "potato",
    category: "vegetable",
    storageLocation: "refrigerator",
    shelfLife: 5,
    defaultUnit: "pcs",
    isPerishable: true,
  },
  noriSeaweed: {
    id: "noriSeaweed",
    category: "vegetable",
    storageLocation: "pantry",
    shelfLife: 365,
    defaultUnit: "pcs",
    isPerishable: false,
  },
};

/**
 * Get ingredient metadata by ID
 */
export function getIngredientMetadata(
  ingredientId: string
): IngredientMetadata | undefined {
  return INGREDIENT_REGISTRY[ingredientId];
}

/**
 * Get all ingredients in a category
 */
export function getIngredientsByCategory(
  category: IngredientCategory
): IngredientMetadata[] {
  return Object.values(INGREDIENT_REGISTRY).filter(
    (ing) => ing.category === category
  );
}

/**
 * Get all ingredients by storage location
 */
export function getIngredientsByStorage(
  location: StorageLocation
): IngredientMetadata[] {
  return Object.values(INGREDIENT_REGISTRY).filter(
    (ing) => ing.storageLocation === location
  );
}

/**
 * Check if ingredient is perishable
 */
export function isPerishable(ingredientId: string): boolean {
  return INGREDIENT_REGISTRY[ingredientId]?.isPerishable ?? false;
}

/**
 * Get all ingredient categories
 */
export function getAllCategories(): IngredientCategory[] {
  return Array.from(
    new Set(Object.values(INGREDIENT_REGISTRY).map((ing) => ing.category))
  );
}

/**
 * Get all storage locations
 */
export function getAllStorageLocations(): StorageLocation[] {
  return Array.from(
    new Set(
      Object.values(INGREDIENT_REGISTRY).map((ing) => ing.storageLocation)
    )
  );
}

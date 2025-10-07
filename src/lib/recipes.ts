const RECIPE_FLUID_UNITS = {
  ml: 1,
  cl: 10,
  dl: 100,
  l: 1000,
};

const RECIPE_WEIGHT_UNITS = {
  g: 1,
  kg: 1000,
};

const RECIPE_SPOON_UNITS = {
  tsp: 1,
  tbsp: 3,
};

const RECIPE_ARBITRARY_UNITS = {
  pcs: 1,
  pinch: 1,
  cup: 1,
};

const RECIPE_INGREDIENT_UNITS = {
  clove: 1,
  sprig: 1,
  leaf: 1,
  slice: 1,
};

export const RECIPE_UNITS = {
  fluid: {
    isScalable: true,
    units: RECIPE_FLUID_UNITS,
  },
  weight: {
    isScalable: true,
    units: RECIPE_WEIGHT_UNITS,
  },
  spoon: {
    isScalable: false,
    units: RECIPE_SPOON_UNITS,
  },
  arbitrary: {
    isScalable: false,
    units: RECIPE_ARBITRARY_UNITS,
  },
  ingredient: {
    isScalable: false,
    units: RECIPE_INGREDIENT_UNITS,
  },
};

export type RecipeFluidUnit = keyof typeof RECIPE_FLUID_UNITS;
export type RecipeWeightUnit = keyof typeof RECIPE_WEIGHT_UNITS;
export type RecipeSpoonUnit = keyof typeof RECIPE_SPOON_UNITS;
export type RecipeArbitraryUnit = keyof typeof RECIPE_ARBITRARY_UNITS;
export type RecipeIngredientUnit = keyof typeof RECIPE_INGREDIENT_UNITS;
export type RecipeUnit =
  | RecipeFluidUnit
  | RecipeWeightUnit
  | RecipeSpoonUnit
  | RecipeArbitraryUnit
  | RecipeIngredientUnit;
export type RecipeUnitTypes = keyof typeof RECIPE_UNITS;

export type RecipeUnitType = {
  isScalable: boolean;
  units: Record<RecipeUnit, number>;
};

export function recalculateQuantity(
  unit: RecipeUnit,
  quantity: number,
  recalculate: boolean = false
): string {
  const unitType = getUnitType(unit);
  if (unitType?.isScalable || recalculate) {
    return `${quantity} ${unit}`;
  }
  return `${quantity} ${unitType?.units[unit]}`;
}

export function getUnitType(unit: RecipeUnit): RecipeUnitType | undefined {
  Object.entries(RECIPE_UNITS).forEach(([unitType, unitTypeValue]) => {
    if (unitTypeValue.units.hasOwnProperty(unit)) {
      return unitTypeValue;
    }
  });
  return undefined;
}

export interface RecipeIngredient {
  ingredient: string;
  quantity: number;
  optional?: boolean;
  unit: RecipeUnit;
}

export type KitchenTool = string;
export type Kitchen =
  | "indian"
  | "western"
  | "asian"
  | "latinAmerican"
  | "middleEastern"
  | "african"
  | "oceanic"
  | "caribbean"
  | "swiss"
  | "selfmade"
  | "japanese";

export interface Allergies {
  gluten?: boolean;
  lactose?: boolean;
  egg?: boolean;
  soy?: boolean;
  nuts?: boolean;
}

export interface Recipe {
  relatedRecipes?: string[];
  dateCreated: string;
  servings: number;
  kitchenTools?: KitchenTool[];
  kitchen: Kitchen;
  calories?: number;
  allergies?: Allergies;
  ingredients: RecipeIngredient[];
  preparationTime: number;
  cookingTime: number;
  totalTime: number;
}

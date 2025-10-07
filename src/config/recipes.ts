import { Recipe } from "@/lib/recipes";

export const RECIPES: Record<string, Recipe> = {
  indianButterChicken: {
    dateCreated: "2025-01-01",
    relatedRecipes: ["naanBread", "rice"],
    kitchen: "indian",
    allergies: {
      lactose: true,
    },
    servings: 3,
    ingredients: [
      {
        quantity: 400,
        unit: "g",
        ingredient: "chickenBreast",
      },
      {
        quantity: 3,
        unit: "clove",
        ingredient: "garlic",
      },
      {
        quantity: 2,
        unit: "tbsp",
        ingredient: "corianderPowder",
      },
      {
        quantity: 2,
        unit: "tbsp",
        ingredient: "cuminPowder",
        optional: true,
      },
      {
        quantity: 2,
        unit: "tbsp",
        ingredient: "curryPowder",
      },
      {
        quantity: 2,
        unit: "tbsp",
        ingredient: "turmericPowder",
        optional: true,
      },
      {
        quantity: 250,
        unit: "g",
        ingredient: "yogurt",
      },
      {
        quantity: 50,
        unit: "g",
        ingredient: "butter",
      },
      {
        quantity: 2,
        unit: "pcs",
        ingredient: "onion",
      },
      {
        quantity: 2,
        unit: "pcs",
        ingredient: "tomato",
      },
      {
        quantity: 250,
        unit: "ml",
        ingredient: "cream",
      },
    ],
    preparationTime: 10,
    cookingTime: 20,
    totalTime: 30,
  },
  riceCookerOnePot: {
    dateCreated: "2025-01-01",
    relatedRecipes: ["rice"],
    kitchen: "japanese",
    allergies: {
      soy: true,
      egg: true,
    },
    servings: 4,
    ingredients: [
      {
        quantity: 2,
        unit: "cup",
        ingredient: "rice",
      },
      {
        quantity: 2,
        unit: "cup",
        ingredient: "water",
      },
      {
        quantity: 2,
        unit: "pcs",
        ingredient: "springOnion",
      },
      {
        quantity: 2,
        unit: "pcs",
        ingredient: "egg",
      },
      {
        quantity: 300,
        unit: "g",
        ingredient: "chickenBreast",
      },
      {
        quantity: 1,
        unit: "tsp",
        ingredient: "salt",
      },
      {
        quantity: 2,
        unit: "tbsp",
        ingredient: "soySauce",
      },
    ],
    preparationTime: 5,
    cookingTime: 5,
    totalTime: 40,
  },
  
};

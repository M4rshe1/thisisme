"use client";

import React, { useState, useEffect } from "react";
import { useTranslations, useMessages } from "next-intl";
import { INGREDIENT_REGISTRY, IngredientMetadata } from "@/lib/ingredients";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Package, Plus, Trash2 } from "lucide-react";
import { toTitleCase } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface InventoryItem {
  ingredientId: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
}

const Inventory: React.FC = () => {
  const t = useTranslations("recipes");
  const messages = useMessages();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const ingredientsMessages = (messages?.recipes?.ingredients ??
    {}) as Record<string, string | undefined>;

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("recipe-inventory");
    if (saved) {
      try {
        setInventory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load inventory", e);
      }
    }
  }, []);

  useEffect(() => {
    // Save to localStorage
    if (inventory.length > 0 || localStorage.getItem("recipe-inventory")) {
      localStorage.setItem("recipe-inventory", JSON.stringify(inventory));
    }
  }, [inventory]);

  const getIngredientName = (ingredientId: string): string => {
    return (
      ingredientsMessages[ingredientId] ??
      t(`ingredients.${ingredientId}`) ??
      toTitleCase(ingredientId)
    );
  };

  const addItem = (ingredientId: string, quantity: number, unit: string) => {
    setInventory([
      ...inventory,
      {
        ingredientId,
        quantity,
        unit,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setInventory(inventory.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    const newInventory = [...inventory];
    newInventory[index].quantity = quantity;
    setInventory(newInventory);
  };

  const getInventoryForIngredient = (ingredientId: string): number => {
    return inventory
      .filter((item) => item.ingredientId === ingredientId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const groupedInventory = inventory.reduce(
    (acc, item) => {
      const metadata = INGREDIENT_REGISTRY[item.ingredientId];
      const location = metadata?.storageLocation || "other";
      if (!acc[location]) {
        acc[location] = [];
      }
      acc[location].push(item);
      return acc;
    },
    {} as Record<string, InventoryItem[]>
  );

  const storageLocationLabels: Record<string, string> = {
    pantry: t("shoppingList.storage.pantry") ?? "Pantry",
    refrigerator: t("shoppingList.storage.refrigerator") ?? "Refrigerator",
    freezer: t("shoppingList.storage.freezer") ?? "Freezer",
    spiceRack: t("shoppingList.storage.spiceRack") ?? "Spice Rack",
    counter: t("shoppingList.storage.counter") ?? "Counter",
    other: t("shoppingList.storage.other") ?? "Other",
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          {t("inventory.title") ?? "Inventory"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("inventory.title") ?? "My Inventory"}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="text-sm text-gray-400">
            {t("inventory.description") ??
              "Track what ingredients you have at home"}
          </div>

          {Object.keys(groupedInventory).length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{t("inventory.empty") ?? "No items in inventory"}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedInventory).map(([location, items]) => (
                <div key={location} className="space-y-2">
                  <h3 className="font-semibold text-sm text-gray-300">
                    {storageLocationLabels[location] ?? location}
                  </h3>
                  <div className="space-y-2 pl-4 border-l-2 border-gray-800">
                    {items.map((item, idx) => {
                      const globalIdx = inventory.findIndex(
                        (i) => i === item
                      );
                      const metadata = INGREDIENT_REGISTRY[item.ingredientId];
                      return (
                        <div
                          key={globalIdx}
                          className="flex items-center gap-3 p-2 rounded-md border border-gray-800 bg-black/20"
                        >
                          <div className="flex-1">
                            <div className="font-medium">
                              {getIngredientName(item.ingredientId)}
                            </div>
                            <div className="text-sm text-gray-400">
                              {item.quantity} {item.unit}
                            </div>
                          </div>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(globalIdx, Number(e.target.value))
                            }
                            className="w-20"
                            min="0"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(globalIdx)}
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-gray-800">
            <h3 className="font-semibold mb-2">
              {t("inventory.addItem") ?? "Add Item"}
            </h3>
            <AddInventoryItemForm onAdd={addItem} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface AddInventoryItemFormProps {
  onAdd: (ingredientId: string, quantity: number, unit: string) => void;
}

const AddInventoryItemForm: React.FC<AddInventoryItemFormProps> = ({
  onAdd,
}) => {
  const t = useTranslations("recipes");
  const messages = useMessages();
  const [ingredientId, setIngredientId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("");

  const ingredientsMessages = (messages?.recipes?.ingredients ??
    {}) as Record<string, string | undefined>;

  const availableIngredients = Object.values(INGREDIENT_REGISTRY);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredientId && quantity > 0 && unit) {
      onAdd(ingredientId, quantity, unit);
      setIngredientId("");
      setQuantity(1);
      setUnit("");
    }
  };

  const selectedIngredient = INGREDIENT_REGISTRY[ingredientId];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        <select
          value={ingredientId}
          onChange={(e) => {
            setIngredientId(e.target.value);
            if (e.target.value) {
              const metadata = INGREDIENT_REGISTRY[e.target.value];
              setUnit(metadata?.defaultUnit || "");
            }
          }}
          className="rounded-md border border-gray-800 bg-black/30 px-3 py-2 text-sm"
        >
          <option value="">
            {t("inventory.selectIngredient") ?? "Select ingredient"}
          </option>
          {availableIngredients.map((ing) => (
            <option key={ing.id} value={ing.id}>
              {ingredientsMessages[ing.id] ??
                t(`ingredients.${ing.id}`) ??
                toTitleCase(ing.id)}
            </option>
          ))}
        </select>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder={t("inventory.quantity") ?? "Quantity"}
          min="0.1"
          step="0.1"
        />
        <Input
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder={t("inventory.unit") ?? "Unit"}
        />
      </div>
      <Button type="submit" size="sm" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        {t("inventory.add") ?? "Add"}
      </Button>
    </form>
  );
};

export default Inventory;
export { Inventory };

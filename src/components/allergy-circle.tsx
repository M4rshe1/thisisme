import { Allergies } from "@/lib/recipes";
import { Egg, Wheat, Bean, Milk, Nut } from "lucide-react";

export const AllergyCircle = ({ allergy }: { allergy: keyof Allergies }) => {
  switch (allergy) {
    case "gluten":
      return (
        <span className="rounded-full border border-yellow-400 px-0.5 py-0.5 text-yellow-400 bg-yellow-400/20">
          <Wheat className="w-4 h-4" />
        </span>
      );
    case "lactose":
      return (
        <span className="rounded-full border border-blue-300 px-0.5 py-0.5 text-blue-300 bg-blue-300/20">
          <Milk className="w-4 h-4" />
        </span>
      );
    case "egg":
      return (
        <span className="rounded-full border border-orange-400 px-0.5 py-0.5 text-orange-400 bg-orange-400/20">
          <Egg className="w-4 h-4" />
        </span>
      );
    case "soy":
      return (
        <span className="rounded-full border border-green-200 px-0.5 py-0.5 text-green-200 bg-green-200/20">
          <Bean className="w-4 h-4" />
        </span>
      );
    case "nuts":
      return (
        <span className="rounded-full border border-[#5d2101] px-0.5 py-0.5 text-[#5d2101] bg-[#5d2101]/20">
          <Nut className="w-4 h-4" />
        </span>
      );
  }
};

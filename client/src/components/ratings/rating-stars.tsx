import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function RatingStars({ 
  value, 
  onChange, 
  readOnly = false,
  size = "md" 
}: RatingStarsProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "h-3.5 w-3.5";
      case "lg":
        return "h-6 w-6";
      default:
        return "h-5 w-5";
    }
  };
  
  const renderStar = (starValue: number) => {
    const isActive = (hoverValue !== null ? hoverValue : value) >= starValue;
    const sizeClass = getSizeClass();
    
    return (
      <Star
        key={starValue}
        className={cn(
          sizeClass,
          isActive ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200",
          !readOnly && "cursor-pointer transition-colors hover:fill-yellow-400 hover:text-yellow-400"
        )}
        onClick={() => {
          if (!readOnly && onChange) {
            onChange(starValue);
          }
        }}
        onMouseEnter={() => {
          if (!readOnly) {
            setHoverValue(starValue);
          }
        }}
        onMouseLeave={() => {
          if (!readOnly) {
            setHoverValue(null);
          }
        }}
      />
    );
  };
  
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(renderStar)}
    </div>
  );
}

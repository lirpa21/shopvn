"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";
import type { VariantOption, ProductVariant } from "@/lib/mock-data";

interface VariantSelectorProps {
  variantOptions: VariantOption[];
  variants: ProductVariant[];
  selectedOptions: Record<string, string>;
  onChange: (optionName: string, value: string) => void;
}

export default function ProductVariantSelector({
  variantOptions,
  variants,
  selectedOptions,
  onChange,
}: VariantSelectorProps) {
  // Find the current matching variant
  const currentVariant = useMemo(() => {
    return variants.find((v) =>
      Object.entries(v.options).every(
        ([key, val]) => selectedOptions[key] === val
      )
    );
  }, [variants, selectedOptions]);

  // Check if a specific value for an option is available (has stock)
  const isValueAvailable = (optionName: string, value: string): boolean => {
    // Build a partial selection with the proposed value
    const testSelection = { ...selectedOptions, [optionName]: value };

    // Check if any variant matches this partial selection and has stock
    return variants.some((v) => {
      const matches = Object.entries(testSelection).every(
        ([key, val]) => v.options[key] === val
      );
      return matches && v.stock > 0;
    });
  };

  // Get color hex for a specific color value
  const getColorHex = (optionName: string, value: string): string | undefined => {
    if (optionName !== "Màu sắc") return undefined;
    const variant = variants.find((v) => v.options[optionName] === value && v.colorHex);
    return variant?.colorHex;
  };

  // Check if it's a color option
  const isColorOption = (optionName: string) => {
    return optionName === "Màu sắc" || optionName.toLowerCase().includes("color");
  };

  return (
    <div className="space-y-5">
      {variantOptions.map((option) => (
        <div key={option.name}>
          {/* Option Label */}
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-sm font-medium">{option.name}:</span>
            {selectedOptions[option.name] && (
              <span className="text-sm text-accent font-medium">
                {selectedOptions[option.name]}
              </span>
            )}
          </div>

          {/* Option Values */}
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              const available = isValueAvailable(option.name, value);
              const colorHex = getColorHex(option.name, value);
              const showColorSwatch = isColorOption(option.name) && colorHex;

              if (showColorSwatch) {
                // Color Swatch Button
                return (
                  <button
                    key={value}
                    onClick={() => onChange(option.name, value)}
                    disabled={!available}
                    title={value}
                    className={`relative group transition-all duration-200 ${
                      !available ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-accent ring-2 ring-accent/30 scale-110"
                          : "border-border hover:border-accent/50 hover:scale-105"
                      }`}
                      style={{ backgroundColor: colorHex }}
                    >
                      {/* Check mark for light colors */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Check
                            className={`h-4 w-4 ${
                              isLightColor(colorHex)
                                ? "text-gray-800"
                                : "text-white"
                            }`}
                            strokeWidth={3}
                          />
                        </motion.div>
                      )}
                    </div>
                    {/* Slash for unavailable */}
                    {!available && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[120%] h-0.5 bg-muted-foreground/40 rotate-45 rounded" />
                      </div>
                    )}
                    {/* Tooltip */}
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {value}
                    </span>
                  </button>
                );
              }

              // Text/Size Button
              return (
                <button
                  key={value}
                  onClick={() => onChange(option.name, value)}
                  disabled={!available}
                  className={`relative min-w-[42px] h-10 px-4 text-sm font-medium rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-accent bg-accent/10 text-accent dark:bg-accent/20"
                      : available
                      ? "border-border hover:border-accent/50 hover:bg-secondary/80 text-foreground"
                      : "border-border/40 text-muted-foreground/40 cursor-not-allowed bg-secondary/30 line-through"
                  }`}
                >
                  {value}
                  {isSelected && (
                    <motion.div
                      layoutId={`variant-check-${option.name}`}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center"
                    >
                      <Check className="h-2.5 w-2.5 text-accent-foreground" strokeWidth={3} />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Stock info for selected variant */}
      {currentVariant && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-1.5 text-xs ${
            currentVariant.stock <= 5
              ? "text-orange-500"
              : "text-muted-foreground"
          }`}
        >
          {currentVariant.stock <= 5 ? (
            <>
              <AlertCircle className="h-3.5 w-3.5" />
              Chỉ còn {currentVariant.stock} sản phẩm
            </>
          ) : (
            <>Còn {currentVariant.stock} sản phẩm</>
          )}
        </motion.div>
      )}
    </div>
  );
}

// Helper: determine if a hex color is light
function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}

import { brand } from "@/config/brand";
import { useState } from "react";

type ZaverreMarkProps = {
  className?: string;
  label?: string;
};

export function ZaverreMark({ className = "", label = "" }: ZaverreMarkProps) {
  const [imageUnavailable, setImageUnavailable] = useState(false);
  const classes = `zaverre-mark ${className}${imageUnavailable ? " zaverre-mark--fallback" : ""}`.trim();

  if (imageUnavailable) {
    return <span className={classes} aria-label={label || undefined}>Z</span>;
  }

  return <img src={brand.monogram} alt={label} className={classes} onError={() => setImageUnavailable(true)} />;
}

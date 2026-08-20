import { brand } from "@/config/brand";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";

type ZaverreMarkProps = {
  className?: string;
  label?: string;
};

export function ZaverreMark({ className = "", label = "" }: ZaverreMarkProps) {
  const [imageUnavailable, setImageUnavailable] = useState(false);
  const { theme } = useTheme();
  const source = theme === "light" ? brand.monogramBlue : brand.monogramGold;
  const classes = `zaverre-mark ${className}${imageUnavailable ? " zaverre-mark--fallback" : ""}`.trim();

  if (imageUnavailable) {
    return <span className={classes} aria-label={label || undefined}>Z</span>;
  }

  return <img src={source} alt={label} className={classes} onError={() => setImageUnavailable(true)} />;
}

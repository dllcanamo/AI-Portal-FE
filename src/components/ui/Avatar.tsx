import { cn } from "@/lib/utils";
import {
  Pencil,
  Code,
  Search,
  Lightbulb,
  Database,
  FileBarChart,
  FlaskConical,
  Rocket,
  Bot,
  type LucideIcon,
} from "lucide-react";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  icon?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  pencil: Pencil,
  code: Code,
  search: Search,
  lightbulb: Lightbulb,
  database: Database,
  "file-bar-chart": FileBarChart,
  "flask-conical": FlaskConical,
  rocket: Rocket,
};

const sizeStyles: Record<AvatarSize, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
};

const iconSizes: Record<AvatarSize, number> = {
  sm: 16,
  md: 20,
  lg: 28,
};

/**
 * Renders an agent/user avatar with an icon or initials fallback.
 */
export function Avatar({ icon, name, size = "md", className }: AvatarProps) {
  const IconComponent = icon ? iconMap[icon] : null;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400",
        sizeStyles[size],
        className
      )}
    >
      {IconComponent ? (
        <IconComponent size={iconSizes[size]} />
      ) : name ? (
        <span className="text-sm font-semibold">
          {name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)}
        </span>
      ) : (
        <Bot size={iconSizes[size]} />
      )}
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { getTypeColor } from "@/lib/typeColors";
import { capitalise } from "@/lib/utils";

interface TypeBadgeProps {
  type: string;
  className?: string;
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  const color = getTypeColor(type);
  
  return (
    <Badge 
      variant="outline" 
      className={className}
      style={{
        backgroundColor: `${color}1A`, // ~10% opacity for light background
        borderColor: color,
        color: color,
      }}
    >
      {capitalise(type)}
    </Badge>
  );
}

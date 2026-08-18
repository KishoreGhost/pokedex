import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function SkeletonCard() {
  return (
    <Card className="overflow-hidden border-border/50">
      <CardHeader className="p-0 bg-muted/20">
        <Skeleton className="h-48 w-full rounded-none" />
      </CardHeader>
      <CardContent className="p-4 pb-2">
        <div className="flex justify-between items-start mb-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-12" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </CardFooter>
    </Card>
  );
}

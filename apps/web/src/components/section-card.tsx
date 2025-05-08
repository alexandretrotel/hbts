import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SectionCardProps {
  title: string;
  badge?: string;
  children: React.ReactNode;
}

export function SectionCard({ title, badge, children }: SectionCardProps) {
  return (
    <div className="flex flex-col justify-between gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>

        {badge && (
          <Badge className="font-normal">
            <span className="text-sm">{badge}</span>
          </Badge>
        )}
      </div>

      <Card>
        <CardContent className="space-y-6">{children}</CardContent>
      </Card>
    </div>
  );
}

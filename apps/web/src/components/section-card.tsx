import { Card, CardContent } from "@/components/ui/card";

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <div className="flex flex-col justify-between gap-4">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <Card>
        <CardContent className="space-y-6">{children}</CardContent>
      </Card>
    </div>
  );
}

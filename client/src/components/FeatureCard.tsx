import type{ LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="flex flex-col items-center text-center p-8 rounded-lg border border-border bg-card hover:border-brand-accent transition-all duration-300 hover:shadow-lg">
      <div className="mb-4 p-4 rounded-full bg-primary/10">
        <Icon className="w-8 h-8 text-brand-accent" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground font-light">{description}</p>
    </div>
  );
};

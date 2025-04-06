
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  textClass?: string;
}

const DashboardCard = ({ title, value, icon: Icon, color, textClass }: DashboardCardProps) => {
  return (
    <Card className="border-none shadow-md">
      <CardContent className={`p-6 flex items-start justify-between ${color}`}>
        <div>
          <div className={`text-3xl font-bold ${textClass || "text-white"}`}>{value}</div>
          <div className={`text-sm mt-1 ${textClass || "text-white/80"}`}>{title}</div>
        </div>
        <div className="p-2 rounded-md bg-white/20">
          <Icon className={`h-6 w-6 ${textClass || "text-white"}`} />
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;

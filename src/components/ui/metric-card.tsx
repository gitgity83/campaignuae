
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  status?: 'success' | 'warning' | 'danger' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  icon?: React.ReactNode;
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  status, 
  trend, 
  className,
  icon 
}: MetricCardProps) {
  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
        {status && (
          <StatusBadge status={status}>
            {status === 'success' && '●'}
            {status === 'warning' && '●'}
            {status === 'danger' && '●'}
            {status === 'info' && '●'}
          </StatusBadge>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
        {trend && (
          <div className={cn(
            "flex items-center text-xs mt-2",
            trend.isPositive ? "text-success-600" : "text-danger-600"
          )}>
            <span className={cn(
              "mr-1",
              trend.isPositive ? "↗" : "↘"
            )}>
              {trend.isPositive ? "↗" : "↘"}
            </span>
            {Math.abs(trend.value)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}

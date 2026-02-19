'use client';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  trend?: Array<{ date: string; value: number }>;
}

export function AnalyticsCard({ title, value, change, icon, trend }: AnalyticsCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        {icon && (
          <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
      {change && (
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium ${
              change.isPositive
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {change.isPositive ? '+' : ''}
            {change.value}%
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">vs last period</span>
        </div>
      )}
      {trend && trend.length > 0 && (
        <div className="mt-4 h-12 flex items-end gap-1">
          {trend.map((point, index) => {
            const maxValue = Math.max(...trend.map(t => t.value));
            const height = (point.value / maxValue) * 100;
            return (
              <div
                key={index}
                className="flex-1 bg-teal-500 rounded-t transition-all hover:bg-teal-600"
                style={{ height: `${height}%` }}
                title={`${point.date}: ${point.value}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}


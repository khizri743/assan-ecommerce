import { AdminCard } from "../shared/AdminCard";
import { UserPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type BusinessActivity = {
  id: string;
  name: string;
  createdAt: Date;
};

export function RecentActivity({
  initialActivities,
}: {
  initialActivities: BusinessActivity[];
}) {
  return (
    <AdminCard title="Recent Activity" subtitle="Latest platform events">
      <div className="space-y-4">
        {initialActivities.length === 0 ? (
          <p className="text-sm text-gray-500">No recent activity.</p>
        ) : (
          initialActivities.map((biz) => (
            <div key={biz.id} className="flex gap-3">
              <div className="h-8 w-8 rounded-lg border bg-green-50 text-green-700 border-green-100 flex items-center justify-center flex-shrink-0">
                <UserPlus className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 font-medium truncate">
                  New tenant "{biz.name}" registered
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500">system</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(biz.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-dashed border-gray-200">
        View All Activity
      </button>
    </AdminCard>
  );
}

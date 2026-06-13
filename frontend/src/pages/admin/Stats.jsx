import { AdminLayout } from '@/components/layout/AdminLayout';
import { useAdminStats } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Users, CalendarDays } from 'lucide-react';

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <Card className="bg-card border border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="w-5 h-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-foreground font-serif">
          {value ?? '—'}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminStats() {
  const { data: stats, isLoading } = useAdminStats();

  return (
    <AdminLayout>
      <div className="p-8 space-y-8 w-full max-w-4xl mx-auto font-sans">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Site Stats</h1>
          <p className="text-muted-foreground mt-1">Visitor activity across all public pages.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Total Visits"
            value={isLoading ? '...' : stats?.total_visits?.toLocaleString()}
            icon={Eye}
            description="All page views ever recorded"
          />
          <StatCard
            title="Unique Visitors"
            value={isLoading ? '...' : stats?.unique_visitors?.toLocaleString()}
            icon={Users}
            description="Based on hashed IP addresses"
          />
          <StatCard
            title="Visits Today"
            value={isLoading ? '...' : stats?.visits_today?.toLocaleString()}
            icon={CalendarDays}
            description="Page views since midnight"
          />
        </div>
      </div>
    </AdminLayout>
  );
}

import { Switch, Route, Router as WouterRouter, Redirect } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/lib/auth';

import Home from '@/pages/public/Home';
import JobDetails from '@/pages/public/JobDetails';
import NotFound from '@/pages/not-found';

import AdminLogin from '@/pages/admin/Login';
import AdminJobs from '@/pages/admin/Jobs';
import AdminSubscribers from '@/pages/admin/Subscribers';
import AdminStats from '@/pages/admin/Stats';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/jobs/:id" component={JobDetails} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/jobs" component={AdminJobs} />
      <Route path="/admin/subscribers" component={AdminSubscribers} />
      <Route path="/admin/stats" component={AdminStats} />
      <Route path="/admin">{() => <Redirect to="/admin/jobs" />}</Route>
      <Route path="/admin/dashboard">{() => <Redirect to="/admin/jobs" />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

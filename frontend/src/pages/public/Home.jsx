import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { useJobs, useSubscribe, useTrackVisit } from '@/lib/api';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Search, Building, Clock, ArrowRight, Briefcase, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const PAGE_SIZE = 6;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  useTrackVisit('/');
  const { data: jobs, isLoading } = useJobs();
  const subscribe = useSubscribe();

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    if (!searchTerm) return jobs;
    const lower = searchTerm.toLowerCase();
    return jobs.filter(
      (job) =>
        job.company_name.toLowerCase().includes(lower) ||
        job.role_name.toLowerCase().includes(lower)
    );
  }, [jobs, searchTerm]);

  const visibleJobs = filteredJobs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredJobs.length;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    subscribe.mutate(
      { email },
      {
        onSuccess: () => { toast({ title: 'Subscribed!', description: "You'll receive job alerts to your inbox." }); setEmail(''); },
        onError: (err) => toast({ title: 'Error', description: err.message || 'Failed to subscribe. Please try again.', variant: 'destructive' }),
      }
    );
  };

  return (
    <PublicLayout>
      <section className="relative py-24 md:py-32 overflow-hidden bg-card border-b border-border">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
            Find your next <span className="text-primary italic">defining role.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 font-sans">
            Curated opportunities for exceptional professionals. No noise, just the roles that matter.
          </p>
          <div className="relative max-w-xl mx-auto font-sans shadow-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by role or company..."
              className="pl-12 pr-4 py-6 text-lg rounded-xl border-border bg-background"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </section>

      <section id="jobs" className="py-16 md:py-24 container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-foreground">Latest Opportunities</h2>
          <div className="text-sm font-sans text-muted-foreground">
            Showing {visibleJobs.length} of {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-[280px]">
                <CardHeader><Skeleton className="h-6 w-2/3 mb-2" /><Skeleton className="h-4 w-1/2" /></CardHeader>
                <CardContent><Skeleton className="h-20 w-full" /></CardContent>
                <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border border-border">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No jobs found</h3>
            <p className="text-muted-foreground font-sans">Try adjusting your search terms.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleJobs.map((job) => (
                <Card key={job.id} className="group hover:border-primary/50 transition-colors duration-300 flex flex-col bg-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold line-clamp-2">
                      {job.role_name}
                    </CardTitle>

                    <div className="flex items-center gap-4 text-muted-foreground text-sm font-sans flex-wrap">

                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        <span>{job.company_name}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{job.experience} years</span>
                      </div>

                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 pb-4">
                    <p className="text-muted-foreground font-sans line-clamp-3 text-sm">{job.description}</p>
                    <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground font-sans">
                      <Clock className="w-3 h-3" />
                      <span>Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <Link href={`/jobs/${job.id}`}>
                        View Details <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="px-8"
                >
                  Load More Jobs
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="py-20 bg-primary/10 border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Never miss a role.</h2>
          <p className="text-muted-foreground mb-8 font-sans max-w-xl mx-auto">
            Join our curated mailing list. No spam, ever.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto font-sans">
            <Input
              type="email"
              placeholder="Your email address"
              required
              className="flex-1 bg-background"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subscribe.isPending}
            />
            <Button type="submit" disabled={subscribe.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {subscribe.isPending ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        </div>
      </section>
    </PublicLayout>
  );
}

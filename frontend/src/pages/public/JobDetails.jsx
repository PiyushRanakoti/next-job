import { Link, useParams } from 'wouter';
import { useJob, useTrackVisit } from '@/lib/api';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Building, Calendar, ExternalLink ,  MapPin, Briefcase } from 'lucide-react';
import { format } from 'date-fns';

export default function JobDetails() {
  const { id } = useParams();
  useTrackVisit(`/jobs/${id}`);
  const jobId = id ? parseInt(id, 10) : 0;
  const { data: job, isLoading, isError } = useJob(jobId);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Skeleton className="h-8 w-24 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/3 mb-12" />
          <Skeleton className="h-[200px] w-full mb-8" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </PublicLayout>
    );
  }

  if (isError || !job) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-bold mb-4">Job not found</h2>
          <p className="text-muted-foreground mb-8">This opportunity may have expired or been removed.</p>
          <Button asChild><Link href="/">Browse other jobs</Link></Button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button asChild variant="ghost" className="mb-8 pl-0 hover:bg-transparent font-sans text-muted-foreground">
            <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" />Back to jobs</Link>
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">{job.role_name}</h1>
        <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-sans mb-8">
  <div className="flex items-center gap-2">
    <Building className="w-5 h-5 text-primary" />
    <span className="text-lg font-medium text-foreground">
      {job.company_name}
    </span>
  </div>

  <div className="flex items-center gap-2">
    <MapPin className="w-5 h-5 text-primary" />
    <span className="text-lg font-medium text-foreground" >{job.location}</span>
  </div>

  <div className="flex items-center gap-2">
    <Briefcase className="w-5 h-5 text-primary" />
    <span className="text-lg font-medium text-foreground">{job.experience} years</span>
  </div>

  <div className="flex items-center gap-2">
    <Calendar className="w-5 h-5 text-primary" />
    <span className="text-lg font-medium text-foreground">Posted {format(new Date(job.created_at), "MMMM d, yyyy")}</span>
  </div>
</div>
          <Button asChild size="lg" className="w-full sm:w-auto font-sans text-base px-8 bg-primary text-primary-foreground">
            <a href={job.eligibility_link} target="_blank" rel="noopener noreferrer">
              Apply Now <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16 max-w-4xl font-sans">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold font-serif text-foreground mb-6">About the Role</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{job.description}</div>
            </section>
            <section>
              <h2 className="text-2xl font-bold font-serif text-foreground mb-6">Requirements</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{job.requirements}</div>
            </section>
          </div>
          <div className="md:col-span-1">
            <div className="sticky top-24 bg-card p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg mb-4 text-foreground">Interested?</h3>
              <p className="text-muted-foreground text-sm mb-6">Applications are processed directly by the employer.</p>
              <Button asChild className="w-full bg-primary text-primary-foreground">
                <a href={job.eligibility_link} target="_blank" rel="noopener noreferrer">Apply Now</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

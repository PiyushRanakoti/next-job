import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useJobs, useCreateJob, useUpdateJob, useDeleteJob } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

const empty = { company_name: '', role_name: '', description: '', requirements: '', eligibility_link: '', location: '', experience: '' };

export default function AdminJobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState(empty);
  const { toast } = useToast();

  const { data: jobs, isLoading } = useJobs();
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    if (!searchTerm) return jobs;
    const lower = searchTerm.toLowerCase();
    return jobs.filter((j) => j.company_name.toLowerCase().includes(lower) || j.role_name.toLowerCase().includes(lower));
  }, [jobs, searchTerm]);

  const openAdd = () => { setSelectedJob(null); setFormData(empty); setIsFormOpen(true); };
  const openEdit = (job) => {
    setSelectedJob(job);
    setFormData({
      company_name: job.company_name,
      role_name: job.role_name,
      description: job.description,
      requirements: job.requirements,
      eligibility_link: job.eligibility_link,
      location: job.location || '',
      experience: job.experience || ''
    });
    setIsFormOpen(true);
  }; const openDelete = (job) => { setSelectedJob(job); setIsDeleteOpen(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedJob) {
      updateJob.mutate({ id: selectedJob.id, ...formData }, {
        onSuccess: () => { toast({ title: 'Job updated successfully' }); setIsFormOpen(false); },
        onError: () => toast({ title: 'Failed to update job', variant: 'destructive' }),
      });
    } else {
      createJob.mutate(formData, {
        onSuccess: () => { toast({ title: 'Job created successfully' }); setIsFormOpen(false); },
        onError: () => toast({ title: 'Failed to create job', variant: 'destructive' }),
      });
    }
  };

  const handleDelete = () => {
    if (!selectedJob) return;
    deleteJob.mutate(selectedJob.id, {
      onSuccess: () => { toast({ title: 'Job deleted successfully' }); setIsDeleteOpen(false); },
      onError: () => toast({ title: 'Failed to delete job', variant: 'destructive' }),
    });
  };

  const f = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  return (
    <AdminLayout>
      <div className="p-8 space-y-6 w-full max-w-6xl mx-auto font-sans">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif text-foreground">Jobs</h1>
            <p className="text-muted-foreground mt-1">Manage active job listings.</p>
          </div>
          <Button onClick={openAdd} className="bg-primary text-primary-foreground"><Plus className="w-4 h-4 mr-2" />Add Job</Button>
        </div>
        <div className="flex items-center gap-2 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input type="text" placeholder="Search jobs..." className="pl-9 bg-card border-border" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Role</TableHead><TableHead>Company</TableHead><TableHead>Posted</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading jobs...</TableCell></TableRow>
              ) : filteredJobs.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">No jobs found.</TableCell></TableRow>
              ) : filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.role_name}</TableCell>
                  <TableCell>{job.company_name}</TableCell>
                  <TableCell className="text-muted-foreground">{format(new Date(job.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild><a href={job.eligibility_link} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 text-muted-foreground" /></a></Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(job)}><Edit2 className="w-4 h-4 text-muted-foreground" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => openDelete(job)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] font-sans">
          <form onSubmit={handleSubmit}>
            <DialogHeader><DialogTitle className="font-serif text-2xl">{selectedJob ? 'Edit Job' : 'Add New Job'}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Company Name</Label><Input value={formData.company_name} onChange={f('company_name')} required /></div>
                <div className="space-y-2"><Label>Role Title</Label><Input value={formData.role_name} onChange={f('role_name')} required /></div>
              </div>
              <div className="space-y-2"><Label>Application Link</Label><Input type="url" value={formData.eligibility_link} onChange={f('eligibility_link')} required placeholder="https://" /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea rows={5} value={formData.description} onChange={f('description')} required /></div>
              <div className="space-y-2"><Label>Requirements</Label><Textarea rows={4} value={formData.requirements} onChange={f('requirements')} required /></div>
              <div className="space-y-2"><Label>Location</Label><Input value={formData.location} onChange={f('location')} /></div>
              <div className="space-y-2"><Label>Experience</Label><Input value={formData.experience} onChange={f('experience')} /></div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createJob.isPending || updateJob.isPending}>{createJob.isPending || updateJob.isPending ? 'Saving...' : 'Save Job'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="font-sans">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete "{selectedJob?.role_name}" at {selectedJob?.company_name}.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={deleteJob.isPending}>{deleteJob.isPending ? 'Deleting...' : 'Delete Job'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

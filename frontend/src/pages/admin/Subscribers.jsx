import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useSubscribers, useDeleteSubscriber } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Search, Trash2, Download } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminSubscribers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const { toast } = useToast();
  const { data: subscribers, isLoading } = useSubscribers();
  const deleteSubscriber = useDeleteSubscriber();

  const filtered = useMemo(() => {
    if (!subscribers) return [];
    if (!searchTerm) return subscribers;
    return subscribers.filter((s) => s.email.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [subscribers, searchTerm]);

  const openDelete = (sub) => { setSelectedSub(sub); setIsDeleteOpen(true); };

  const handleDelete = () => {
    if (!selectedSub) return;
    deleteSubscriber.mutate(selectedSub.id, {
      onSuccess: () => { toast({ title: 'Subscriber removed successfully' }); setIsDeleteOpen(false); },
      onError: () => toast({ title: 'Failed to remove subscriber', variant: 'destructive' }),
    });
  };

  const handleExport = () => {
    if (!subscribers?.length) return;
    const csv = [['Email', 'Subscribed At'], ...subscribers.map((s) => [s.email, s.subscribed_at])].map((r) => r.join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    Object.assign(document.createElement('a'), { href: url, download: `subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv` }).click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="p-8 space-y-6 w-full max-w-6xl mx-auto font-sans">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif text-foreground">Subscribers</h1>
            <p className="text-muted-foreground mt-1">{subscribers ? `${subscribers.length} total active subscribers.` : 'Loading...'}</p>
          </div>
          <Button onClick={handleExport} variant="outline" disabled={!subscribers?.length}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
        </div>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input type="text" placeholder="Search emails..." className="pl-9 bg-card border-border" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader><TableRow className="bg-muted/50"><TableHead>Email</TableHead><TableHead>Subscribed Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Loading subscribers...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={3} className="text-center py-12 text-muted-foreground">No subscribers found.</TableCell></TableRow>
              ) : filtered.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.email}</TableCell>
                  <TableCell className="text-muted-foreground">{format(new Date(sub.subscribed_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => openDelete(sub)}><Trash2 className="w-4 h-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="font-sans">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Subscriber</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove {selectedSub?.email} from the mailing list.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={deleteSubscriber.isPending}>{deleteSubscriber.isPending ? 'Removing...' : 'Remove'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

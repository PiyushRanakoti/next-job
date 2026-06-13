import { Link } from 'wouter';
import { Briefcase } from 'lucide-react';

export function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col font-serif bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Briefcase className="w-6 h-6" />
            <span>NextJob</span>
          </Link>
          <nav className="flex items-center gap-4">
            <a href="#jobs" className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
              Jobs
            </a>
            <Link href="/admin/login" className="text-sm font-medium hover:text-primary transition-colors">
              Post a Job
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-card py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm font-sans">
          Made by <a href=" https://www.linkedin.com/in/piyushranakoti/" >Piyush Ranakoti</a>
        </div>
      </footer>
    </div>
  );
}

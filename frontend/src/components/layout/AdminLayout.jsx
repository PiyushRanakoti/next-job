import { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { Briefcase, Users, BarChart2, LogOut } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar';

const navItems = [
  { title: 'Jobs', href: '/admin/jobs', icon: Briefcase },
  { title: 'Subscribers', href: '/admin/subscribers', icon: Users },
  { title: 'Stats', href: '/admin/stats', icon: BarChart2 },
];

export function AdminLayout({ children }) {
  const { isAuthenticated, logout } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated && location !== '/admin/login') {
      setLocation('/admin/login');
    }
  }, [isAuthenticated, location, setLocation]);

  if (!isAuthenticated && location !== '/admin/login') return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background font-sans text-foreground">
        <Sidebar>
          <SidebarContent>
            <div className="p-4 flex items-center gap-2 font-serif font-bold text-xl text-primary">
              <Briefcase className="w-6 h-6" />
              <span>NextJob Admin</span>
            </div>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={location === item.href} tooltip={item.title}>
                        <Link href={item.href} className="flex items-center gap-3">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup className="mt-auto">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={logout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">{children}</main>
      </div>
    </SidebarProvider>
  );
}

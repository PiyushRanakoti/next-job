import { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(true);
  return <SidebarContext.Provider value={{ open, setOpen }}>{children}</SidebarContext.Provider>;
}

export function Sidebar({ className, children, ...props }) {
  return (
    <aside className={cn('flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0', className)} {...props}>
      {children}
    </aside>
  );
}

export function SidebarContent({ className, children, ...props }) {
  return <div className={cn('flex flex-1 flex-col gap-2 overflow-auto', className)} {...props}>{children}</div>;
}

export function SidebarGroup({ className, children, ...props }) {
  return <div className={cn('flex flex-col gap-1 px-2 py-2', className)} {...props}>{children}</div>;
}

export function SidebarGroupLabel({ className, children, ...props }) {
  return <div className={cn('px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground', className)} {...props}>{children}</div>;
}

export function SidebarGroupContent({ children }) {
  return <div>{children}</div>;
}

export function SidebarMenu({ children }) {
  return <ul className="space-y-1">{children}</ul>;
}

export function SidebarMenuItem({ children }) {
  return <li>{children}</li>;
}

export function SidebarMenuButton({ asChild, isActive, className, children, tooltip, ...props }) {
  const cls = cn(
    'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
    className
  );
  if (asChild && children) {
    const child = children;
    return <span className={cls} {...props}>{child}</span>;
  }
  return <button className={cls} {...props}>{children}</button>;
}
